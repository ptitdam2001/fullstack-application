# Dashboard Admin

## Définition

Le dashboard Admin est un dashboard **standalone** réservé aux utilisateurs avec `isAdmin: true`. Il offre une vue opérationnelle du système : métriques clés, activité récente, et raccourcis vers les actions critiques.

> Voir `specifications/11-dashboard.md` pour la logique de dispatch vers ce dashboard.

---

## Acteurs concernés

| Rôle              | Accès                                        |
| ----------------- | -------------------------------------------- |
| Admin             | Accès complet                                |
| Tous autres rôles | Pas d'accès - redirigés vers `DashboardTabs` |

---

## Widgets

### 1. KPI Cards

4 cartes métriques affichées en haut du dashboard :

| KPI                        | Donnée                                                  | Source                                                    |
| -------------------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| Matchs en attente de score | Matchs avec `status: SCHEDULED` dont la date est passée | `useGetMatches({ status: 'SCHEDULED', pastDue: true })`   |
| Activations en attente     | Utilisateurs avec `isActive: false`                     | `useGetUsers({ isActive: false })`                        |
| Championnats actifs        | Nombre total de championnats                            | `useCountChampionships()`                                 |
| Équipes totales            | Nombre total d'équipes                                  | `useCountTeams()`                                         |

Chaque carte est cliquable et renvoie vers la liste correspondante (pré-filtrée si applicable).

### 2. Camembert — Répartition des utilisateurs par rôle

Graphique en camembert affichant la proportion d'utilisateurs par rôle :

| Segment   | Condition                               |
| --------- | --------------------------------------- |
| Admin     | `user.isAdmin === true`                 |
| Coach     | `user.roles.includes('COACH')`          |
| Joueur    | `user.roles.includes('PLAYER')`         |
| Arbitre   | `user.roles.includes('REFEREE')`        |
| Sans rôle | Aucun rôle contextuel, `isAdmin: false` |

> Un utilisateur multi-rôles est compté dans chaque segment qui le concerne. Le total du camembert peut dépasser le nombre d'utilisateurs uniques.

Source : `useGetUsers()` (toutes pages), agrégation côté frontend. Le champ `roles` est retourné par `GET /users` (dérivé de UserTeam + isReferee côté backend).

### 3. Live Feed — Activité récente

Flux d'événements rafraîchi toutes les `DASHBOARD_POLLING_INTERVAL_MS` secondes (défaut : 30s).

#### Événements affichés

| Type d'événement     | Critère                                                       | Action inline                       |
| -------------------- | ------------------------------------------------------------- | ----------------------------------- |
| Demande d'activation | Utilisateur avec `isActive: false`, trié par `createdAt` desc | Bouton "Activer" (mutation directe) |
| Équipe créée         | Équipes triées par `createdAt` desc                           | Lien vers la fiche équipe           |
| Forfait déclaré      | Match avec `status: FORFEITED`, trié par date desc            | Lien vers le match                  |
| Match terminé        | Match avec `status: PLAYED`, trié par `scheduledAt` desc      | Lien vers le match                  |

#### Comportement

- Les 4 types d'événements sont **entrelacés** dans un seul flux trié par date décroissante (plus récent en premier)
- Limite d'affichage : **20 événements** maximum
- Icône et couleur différente par type d'événement
- Action "Activer" sur les demandes d'activation déclenche `PUT /users/:id/activate` et retire l'événement du feed immédiatement (optimistic update)

### 4. Raccourcis — Actions critiques

3 boutons d'accès rapide positionnés en haut du dashboard (après les KPI cards) :

| Raccourci              | Destination  |
| ---------------------- | ------------ |
| Gérer les équipes      | `/app/teams` |
| Gérer les utilisateurs | `/app/users` |
| Gérer les matchs       | `/app/games` |

---

## Sidebar Admin (AdminAppSidebar)

La sidebar admin est **mixte** : liens statiques + liens contextuels pré-filtrés avec badges dynamiques.

### Structure

```text
[Logo / Titre]

── Vue globale ──────────────────
  Dashboard                      → /app

── Gestion ──────────────────────
  Championnats                   → /app/championships
  Équipes                        → /app/teams
  Matchs sans score (N)          → /app/games/needsScore [badge dynamique]
  Utilisateurs                   → /app/users
  Activations en attente (N)     → /app/users/inactive [badge dynamique]

── Configuration ─────────────────
  Paramètres                     → /app/settings

── Footer ────────────────────────
  [Avatar] Prénom Nom            → /app/my-profile
```

### Badges dynamiques

| Lien                     | Badge                                         | Source                                                  |
| ------------------------ | --------------------------------------------- | ------------------------------------------------------- |
| "Matchs sans score"      | Nb matchs `SCHEDULED` dont la date est passée | `useGetMatches({ status: 'SCHEDULED', pastDue: true })` |
| "Activations en attente" | Nb utilisateurs `isActive: false`             | `useGetUsers({ isActive: false })`                      |

Les badges se mettent à jour avec le même interval de polling que le dashboard.

---

## Section technique

### Composants à créer

```text
src/Dashboard/ui/AdminDashboard/
├── AdminDashboard.tsx           # Layout principal
├── AdminKpiCards.tsx            # 4 cartes métriques
├── AdminUserPieChart.tsx        # Camembert répartition rôles
├── AdminLiveFeed.tsx            # Flux d'événements
├── AdminLiveFeedEvent.tsx       # Ligne d'événement individuel
└── AdminQuickActions.tsx        # 3 raccourcis

src/Layouts/components/
└── AdminAppSidebar.tsx          # Sidebar admin avec badges
```

### Hook applicatif

```typescript
// src/Dashboard/application/useAdminDashboard.ts
export const useAdminDashboard = () => {
  // KPI : matchs en retard (filtre serveur)
  const { data: overdueMatches } = useGetMatches(
    { status: 'SCHEDULED', pastDue: true },
    { query: { refetchInterval: DASHBOARD_POLLING_INTERVAL_MS } }
  );
  // KPI : activations en attente (filtre serveur)
  const { data: inactiveUsers } = useGetUsers(
    { isActive: false },
    { query: { refetchInterval: DASHBOARD_POLLING_INTERVAL_MS } }
  );
  // Live Feed : sources séparées (filtre serveur par statut)
  const { data: forfeitedMatches } = useGetMatches(
    { status: 'FORFEITED' },
    { query: { refetchInterval: DASHBOARD_POLLING_INTERVAL_MS } }
  );
  const { data: playedMatches } = useGetMatches(
    { status: 'PLAYED' },
    { query: { refetchInterval: DASHBOARD_POLLING_INTERVAL_MS } }
  );
  const { data: teams } = useGetTeams({
    query: { refetchInterval: DASHBOARD_POLLING_INTERVAL_MS },
  });
  // Camembert : tous les utilisateurs avec roles (retournés par GET /users)
  const { data: allUsers } = useGetUsers();
  const { data: championshipCount } = useCountChampionships();
  const { data: teamCount } = useCountTeams();

  const pendingScoreCount = overdueMatches?.length ?? 0;
  const pendingActivationCount = inactiveUsers?.length ?? 0;

  const feedEvents = buildFeedEvents({ inactiveUsers, teams, forfeitedMatches, playedMatches });
  const roleDistribution = buildRoleDistribution(allUsers);

  return {
    pendingScoreCount,
    pendingActivationCount,
    championshipCount,
    teamCount,
    feedEvents,
    roleDistribution,
  };
};
```

### Type FeedEvent

```typescript
type FeedEventType =
  | "ACTIVATION_REQUEST"
  | "TEAM_CREATED"
  | "FORFEIT"
  | "MATCH_COMPLETED";

type FeedEvent = {
  id: string;
  type: FeedEventType;
  label: string;
  date: string; // ISO date pour le tri
  href?: string; // Lien vers la ressource
  actionLabel?: string; // Ex: "Activer" pour ACTIVATION_REQUEST
  onAction?: () => void;
};
```

### Filtres serveur implémentés

Les filtres suivants sont disponibles en V1 :

| Endpoint                                     | Besoin                                      |
| -------------------------------------------- | ------------------------------------------- |
| `GET /matches?status=SCHEDULED&pastDue=true` | Matchs sans score (KPI + badge sidebar)     |
| `GET /matches?status=FORFEITED`              | Forfaits pour live feed                     |
| `GET /matches?status=PLAYED`                 | Matchs terminés pour live feed              |
| `GET /users?isActive=false`                  | Activations en attente (KPI + badge sidebar)|

> `GET /users` retourne désormais un champ `roles[]` (COACH, PLAYER, REFEREE) dérivé des relations UserTeam et du flag `isReferee`. Utilisé pour le camembert et le dispatch sidebar.

> `GET /activity-feed` unifié côté serveur reste une dette technique V2+.

### Librairie graphique

Utiliser **Recharts** (à installer : `pnpm --filter application-material add recharts`). Le camembert utilise `<PieChart>` + `<Pie>` + `<Cell>` avec une palette de couleurs distincte par rôle.
