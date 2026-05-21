# Dashboard Multi-rôles (Coach / Joueur / Arbitre)

## Définition

Le dashboard multi-rôles est affiché pour tout utilisateur non-admin. Il présente un système d'onglets où chaque onglet correspond à un rôle actif de l'utilisateur. Un utilisateur peut avoir 1 à 3 onglets simultanément.

> Voir `specifications/11-dashboard.md` pour la logique de dispatch et l'ordre des onglets.

---

## Onglet Coach

### Acteurs

Affiché si `user.roles.includes('COACH')`.

### Widgets

#### 1. KPI Cards (existantes, conservées)

| KPI            | Donnée                                        |
| -------------- | --------------------------------------------- |
| Mes équipes    | Nombre d'équipes dont l'utilisateur est coach |
| Matchs à venir | Nombre de matchs à venir pour ses équipes     |
| Championnats   | (affiché mais non calculé en V1)              |
| Victoires      | (affiché mais non calculé en V1)              |

#### 2. Classement compact par équipe

Pour chaque équipe du coach, afficher sa position dans sa poule :

| Donnée             | Format                                                   |
| ------------------ | -------------------------------------------------------- |
| Position actuelle  | Rang (ex: `3`)                                           |
| Total participants | Nb équipes dans la poule (ex: `/8`)                      |
| Affichage          | `3 / 8` avec lien vers le classement complet de la poule |

Si l'équipe n'est pas encore dans un championnat, afficher "Non inscrit".

#### 3. Bilan W/D/L — depuis le début du championnat

Pour chaque équipe du coach, afficher le bilan **depuis le début du championnat en cours** (pas seulement les N derniers matchs) :

| Colonne       | Donnée                                                     |
| ------------- | ---------------------------------------------------------- |
| V (Victoires) | Matchs avec `status: PLAYED` où l'équipe a le plus de buts |
| N (Nuls)      | Matchs avec `status: PLAYED` où les buts sont égaux        |
| D (Défaites)  | Matchs avec `status: PLAYED` où l'équipe a moins de buts   |

Affichage sous forme de badges colorés (V = vert, N = gris, D = rouge).

#### 4. Équipes + Agenda matchs

- Tuiles d'équipes cliquables (comportement existant conservé)
- Liste des prochains matchs (8 maximum, triés par date croissante)

---

## Onglet Joueur

### Acteurs

Affiché si `user.roles.includes('PLAYER')`.

### Widgets

#### 1. Mon équipe

Carte affichant l'équipe du joueur :

| Donnée          | Source                               |
| --------------- | ------------------------------------ |
| Nom de l'équipe | `Team.name`                          |
| Couleur         | `Team.color`                         |
| Championnat     | Nom du championnat en cours          |
| Lien            | Vers la fiche équipe `/app/team/:id` |

Si le joueur est dans plusieurs équipes (multi-équipes), afficher une carte par équipe.

#### 2. Prochains matchs

Liste des prochains matchs de **ses équipes** :

- Triés par date croissante
- Limité à 5 matchs
- Affichage : équipe domicile vs équipe extérieure, date, statut
- Lien vers le détail du match

#### 3. Classement de sa poule

Tableau de classement complet de la poule de son équipe, avec **la ligne de l'équipe du joueur mise en évidence** (fond différent, bold).

Colonnes : Rang, Équipe, J, V, N, D, Pts

Si le joueur est dans plusieurs équipes/poules, afficher un classement par poule.

---

## Onglet Arbitre

### Acteurs

Affiché si `user.roles.includes('REFEREE')`.

### Widgets

#### 1. À finaliser — Matchs avec score à saisir (urgents)

Matchs assignés à cet arbitre avec `status: SCHEDULED` et `scheduledAt` dans le passé :

| Donnée      | Affichage                                           |
| ----------- | --------------------------------------------------- |
| Équipes     | Domicile vs Extérieure                              |
| Date prévue | Date du match (passée)                              |
| Retard      | "Prévu il y a X jours"                              |
| Action      | Bouton "Saisir le score" → lien vers page de saisie |

Ces matchs sont affichés **en premier**, avec un indicateur visuel d'urgence (bordure rouge ou badge "En retard").

#### 2. Prochains matchs à arbitrer

Matchs assignés à cet arbitre avec `status: SCHEDULED` et `scheduledAt` dans le futur :

| Donnée      | Affichage                    |
| ----------- | ---------------------------- |
| Équipes     | Domicile vs Extérieure       |
| Date prévue | Date et heure                |
| Lieu        | Si disponible                |
| Action      | Lien vers le détail du match |

Limité à 5 prochains matchs.

> Le classement n'est pas affiché dans l'onglet Arbitre — il est accessible depuis le détail de chaque match.

---

## Section technique

### Structure des composants

```text
src/Dashboard/ui/
├── DashboardTabs/
│   ├── DashboardTabs.tsx         # Conteneur onglets (react-aria Tabs)
│   ├── CoachTab/
│   │   ├── CoachTab.tsx
│   │   ├── CoachStandingCompact.tsx   # Position/total par équipe
│   │   └── CoachWDLBadges.tsx         # Badges V/N/D
│   ├── PlayerTab/
│   │   ├── PlayerTab.tsx
│   │   ├── PlayerTeamCard.tsx
│   │   ├── PlayerUpcomingMatches.tsx
│   │   └── PlayerStandingsTable.tsx   # Classement avec ligne mise en évidence
│   └── RefereeTab/
│       ├── RefereeTab.tsx
│       ├── RefereeUrgentMatches.tsx   # Matchs en retard
│       └── RefereeUpcomingMatches.tsx
```

### Hooks applicatifs

```typescript
// Onglet Coach (enrichissement du hook existant)
// src/Dashboard/application/useCoachDashboard.ts
// Ajouter : standings par équipe + bilan W/D/L depuis début du championnat

// Onglet Joueur
// src/Dashboard/application/usePlayerDashboard.ts
export const usePlayerDashboard = (userId: string) => {
  const { data: teams } = useGetTeams(); // filtrer par userId côté client
  const { data: matches } = useGetMatches(); // filtrer par teamId côté client
  // standings : useGetGroupStandings(groupId) par équipe

  return { playerTeams, upcomingMatches, standings };
};

// Onglet Arbitre
// src/Dashboard/application/useRefereeDashboard.ts
export const useRefereeDashboard = (userId: string) => {
  const { data: refereeMatches } = useGetUserMatches(userId, {
    query: { refetchInterval: DASHBOARD_POLLING_INTERVAL_MS },
  });

  const urgentMatches =
    refereeMatches?.filter(
      (m) => m.status === "SCHEDULED" && dayjs(m.scheduledAt).isBefore(dayjs()),
    ) ?? [];

  const upcomingMatches =
    refereeMatches?.filter(
      (m) => m.status === "SCHEDULED" && dayjs(m.scheduledAt).isAfter(dayjs()),
    ) ?? [];

  return { urgentMatches, upcomingMatches };
};
```

### SDK utilisé

| Hook                            | Onglet        | Usage                         |
| ------------------------------- | ------------- | ----------------------------- |
| `useGetCoachTeams(userId)`      | Coach         | Équipes du coach              |
| `useGetMatches()`               | Coach, Joueur | Matchs (filtrage côté client) |
| `useGetGroupStandings(groupId)` | Coach, Joueur | Classement par poule          |
| `useGetTeams()`                 | Joueur        | Équipes (filtrage par userId) |
| `useGetUserMatches(userId)`     | Arbitre       | Matchs assignés à l'arbitre   |

### Composant Tabs

Utiliser le composant `Tabs` du design system (`@repo/design-system`) qui expose react-aria `Tabs`. Les onglets sont construits dynamiquement :

```typescript
const ROLE_TABS: Array<{
  role: Role;
  label: string;
  component: React.ComponentType;
}> = [
  { role: "COACH", label: "Coach", component: CoachTab },
  { role: "PLAYER", label: "Joueur", component: PlayerTab },
  { role: "REFEREE", label: "Arbitre", component: RefereeTab },
];

// Filtrer selon les rôles actifs de l'utilisateur
const activeTabs = ROLE_TABS.filter((t) => roles.includes(t.role));
```

### Classement — Endpoint dédié (V1)

Le hook `useGetGroupStandings(groupId)` requiert un `groupId`. Cet identifiant est obtenu via un endpoint dédié :

```
GET /teams/:teamId/current-group
→ { groupId, groupName, phaseId, championshipId } | null
```

Retourne `null` si l'équipe n'est inscrite dans aucun championnat actif. Le frontend appelle ensuite `useGetGroupStandings(groupId)` avec le groupId retourné.

### Statut utilisateur sans rôle

Si `roles` est vide et `isAdmin: false`, afficher un état vide avec :

- Message : "Vous n'êtes encore membre d'aucune équipe."
- Bouton : "Rejoindre ou créer une équipe" → `/app/team`
