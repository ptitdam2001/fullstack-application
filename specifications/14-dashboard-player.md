# Dashboard Joueur

## Contexte

Ce document précise et enrichit la description du **PlayerTab** définie dans `specifications/13-dashboard-multirole.md`. Il couvre également la **PlayerAppSidebar** (absente de la spec 13) et le nouvel endpoint `GET /me/teams`.

> La logique de dispatch (DashboardTabs, ordre des onglets) reste dans `specifications/11-dashboard.md` et `specifications/13-dashboard-multirole.md`.

---

## Périmètre fonctionnel

### Conditions d'affichage

Le PlayerTab est affiché dès que `user.roles.includes('PLAYER')`. Un utilisateur peut avoir simultanément les rôles COACH, PLAYER, REFEREE → chaque rôle génère un onglet.

Si le joueur n'est membre d'aucune équipe, afficher un état vide :

> "Vous n'êtes encore membre d'aucune équipe."

---

## Widgets du PlayerTab

### 1. Carte équipe (PlayerTeamCard)

Une carte par équipe dans laquelle le joueur est inscrit. Contenu :

| Donnée           | Source                       | Affichage                          |
| ---------------- | ---------------------------- | ---------------------------------- |
| Couleur          | `Team.color`                 | Point coloré (dot)                 |
| Nom de l'équipe  | `Team.name`                  | Lien cliquable → `/app/team/:id`   |
| Groupe / Poule   | `TeamCurrentGroup.groupName` | Texte secondaire, en haut à droite |

Si l'équipe n'est inscrite dans aucun championnat, la carte reste visible sans mention de groupe.

---

### 2. Prochains matchs (PlayerUpcomingMatches)

**Règles métier :**

- Statut : `SCHEDULED`
- Date : `scheduledAt >= maintenant`
- Tri : croissant par `scheduledAt`
- Limite : 5 matchs max
- Portée : matchs où `homeTeamId === team.id || awayTeamId === team.id`

**Affichage par ligne :**

```
[Date]   [Équipe domicile] vs [Équipe extérieure]   [→ Détail]
```

- Le nom des équipes est résolu depuis la liste complète des équipes
- Chaque ligne est **un lien cliquable** vers `/app/games/:matchId`

---

### 3. Résultats récents (PlayerRecentResults) — NOUVEAU

**Règles métier :**

- Statut : `PLAYED`
- Tri : décroissant par `scheduledAt` (plus récent en premier)
- Limite : 5 matchs max
- Portée : matchs où `homeTeamId === team.id || awayTeamId === team.id`

**Affichage par ligne :**

```
[Badge W/D/L]  [Score]  [Adversaire]  [Date]   [→ Détail]
```

Calcul du badge depuis la perspective de l'équipe du joueur :

| Condition                                          | Badge       |
| -------------------------------------------------- | ----------- |
| L'équipe a plus de buts que l'adversaire           | V (vert)    |
| L'équipe a le même nombre de buts que l'adversaire | N (gris)    |
| L'équipe a moins de buts que l'adversaire          | D (rouge)   |
| Match forfeit (`status: FORFEITED`)                | non affiché |

Score affiché : `homeGoals – awayGoals` (format : `2–1`).

Nom de l'adversaire : équipe opposée (résolue depuis la liste des équipes).

Chaque ligne est **un lien cliquable** vers `/app/games/:matchId`.

---

### 4. Classement de la poule (PlayerStandingsTable)

Tableau de classement complet de la poule, avec **la ligne de l'équipe du joueur mise en évidence** (fond coloré + texte bold).

Colonnes : Rang, Équipe, J (joués), V, N, D, Pts

Si `groupId` est `null` (équipe non inscrite) : afficher "Non inscrit à un championnat".

---

## PlayerAppSidebar

### Conditions d'affichage

Affiché quand `!user.isAdmin && user.roles.includes('PLAYER') && !user.roles.includes('COACH')`.

> Si le joueur est aussi coach, la CoachAppSidebar est prioritaire (Admin > Coach > Player > Referee).

### Structure

```
Groupe : Vue globale
  └─ Dashboard (/app)                           [icône LayoutDashboard]

Groupe : Mon équipe
  └─ [Dot couleur] Nom équipe → /app/team/:id   [icône Users]
  (si plusieurs équipes, liste toutes)
  └─ "Aucune équipe" (si liste vide, désactivé)

Groupe : Saison
  └─ Calendrier (/app/calendar)                 [icône CalendarDays]
  └─ Matchs (/app/games)                        [icône Activity]
```

Footer : `AppSidebarFooter` (profil + déconnexion) — réutilisé tel quel.

---

## Section technique

### Endpoint — `GET /me/teams`

**Portée :** Retourne tous les `UserTeam` du joueur courant (tous rôles : COACH, PLAYER).  
**Auth :** JWT requis. Le `userId` est extrait du token — aucun paramètre dans l'URL.  
**Note :** Le frontend filtre `role === 'PLAYER'` pour le PlayerTab. Le CoachAppSidebar pourra migrer vers cet endpoint plus tard.

**Réponse :**

```json
[
  {
    "id": "userteam-uuid",
    "teamId": "team-uuid",
    "role": "PLAYER",
    "team": {
      "id": "team-uuid",
      "name": "FC Lyon",
      "color": "#E74C3C"
    }
  }
]
```

**OpenAPI :**

```yaml
/me/teams:
  get:
    summary: Get teams of the current authenticated user
    operationId: getMyTeams
    tags: [auth]
    security:
      - bearerAuth: []
    responses:
      '200':
        description: List of UserTeams for the current user
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/UserTeamWithTeam'
      '401':
        $ref: '#/components/responses/Unauthorized'
```

**Schéma `UserTeamWithTeam` :**

```yaml
UserTeamWithTeam:
  type: object
  required: [id, teamId, role, team]
  properties:
    id:
      type: string
    teamId:
      type: string
    role:
      type: string
      enum: [COACH, PLAYER]
    team:
      $ref: '#/components/schemas/Team'
```

**Handler backend :**

```typescript
async getMyTeams(req, res) {
  const userId = req.user.id
  const userTeams = await UserTeam.findMany({
    where: { userId, ...notDeleted },
    include: { team: true },
  })
  res.json(userTeams)
}
```

**Bruno :** `backend/bruno/auth/getMyTeams.bru`

---

### Structure des composants

```text
src/Dashboard/
├── application/
│   └── usePlayerDashboard.ts          # enrichi : useGetMyTeams() + filterRecentResults()
├── ui/
│   ├── AppSidebar/
│   │   ├── PlayerAppSidebar.tsx        # nouveau (stub vide → implémentation complète)
│   │   └── AppSidebar.tsx             # ajouter import PlayerAppSidebar
│   └── DashboardTabs/
│       └── PlayerTab/
│           ├── PlayerTab.tsx           # inchangé
│           ├── PlayerTeamCard.tsx      # enrichi : noms adversaires + PlayerRecentResults
│           ├── PlayerStandingsTable.tsx # inchangé
│           └── PlayerRecentResults.tsx  # nouveau
```

---

### Hooks applicatifs

```typescript
// usePlayerDashboard.ts — version enrichie
export const filterRecentResults = (matches: Match[], teamId: string, now = new Date()): Match[] =>
  matches
    .filter(
      (m) =>
        m.status === MatchStatus.PLAYED &&
        (m.homeTeamId === teamId || m.awayTeamId === teamId),
    )
    .sort((a, b) => new Date(b.scheduledAt!).getTime() - new Date(a.scheduledAt!).getTime())
    .slice(0, 5)

export const usePlayerDashboard = () => {
  const refetchInterval = DASHBOARD_POLLING_INTERVAL_MS

  // Remplace useGetTeams() — endpoint dédié, filtre PLAYER côté frontend
  const { data: myTeams = [] } = useGetMyTeams({ query: { refetchInterval } })
  const playerTeams = myTeams.filter((ut) => ut.role === 'PLAYER').map((ut) => ut.team)

  // Pour résoudre les noms d'adversaires
  const { data: allTeams = [] } = useGetTeams(undefined, { query: { refetchInterval } })

  const { data: allMatches = [] } = useGetMatches(undefined, { query: { refetchInterval } })

  return {
    playerTeams,
    allTeams,
    upcomingMatches: filterUpcomingMatches(allMatches),
    allMatches,
  }
}
```

---

### SDK généré après openapi.yml

```typescript
// Hook orval généré dans src/sdk/generated/
useGetMyTeams()   // GET /me/teams → UserTeamWithTeam[]
```

Après modification de `openapi.yml` : `pnpm --filter application-material gen:sdk`.

---

## Tests

### Backend — `getMyTeams` handler

Fichier : `backend/src/auth/application/AuthUseCases.test.ts` (ou nouveau fichier dédié selon domaine).

| Cas de test | Description |
|-------------|-------------|
| Retourne [] si le user n'a aucune équipe | `UserTeam.findMany` retourne `[]` |
| Retourne les équipes COACH et PLAYER du user | Filter correct par `userId` |
| Exclut les UserTeam soft-deletés | `deletedAt != null` exclus via `notDeleted` |
| Inclut les données `team` (join) | `team.name`, `team.color` présents dans la réponse |
| Retourne 401 si non authentifié | Middleware auth bloque avant le handler |

---

### Frontend — `filterRecentResults` (pur)

Fichier : `src/Dashboard/application/usePlayerDashboard.test.ts` (étendre le fichier existant).

| Cas de test | Description |
|-------------|-------------|
| Retourne [] si aucun match | Pas de crash |
| Exclut les matchs non-PLAYED | `SCHEDULED`, `CANCELLED`, `FORFEITED` ignorés |
| Inclut uniquement les matchs de l'équipe | `homeTeamId` ou `awayTeamId` correspond |
| Tri décroissant par `scheduledAt` | Plus récent en premier |
| Limite à 5 résultats | 6e match non retourné |
| Exclut les matchs sans `scheduledAt` | Pas de crash sur `null` |

---

### Clés i18n

#### `playerSidebar.*`

| Clé | FR | EN |
|-----|----|----|
| `playerSidebar.globalView` | Vue globale | Overview |
| `playerSidebar.dashboard` | Tableau de bord | Dashboard |
| `playerSidebar.myTeam` | Mon équipe | My team |
| `playerSidebar.noTeam` | Aucune équipe | No team |
| `playerSidebar.season` | Saison | Season |
| `playerSidebar.calendar` | Calendrier | Calendar |
| `playerSidebar.games` | Matchs | Matches |
| `playerSidebar.myProfile` | Mon profil | My profile |

#### `playerDashboard.*`

| Clé | FR | EN |
|-----|----|----|
| `playerDashboard.noTeam` | Vous n'êtes encore membre d'aucune équipe. | You are not a member of any team yet. |
| `playerDashboard.notEnrolled` | Équipe non inscrite à un championnat. | Team not enrolled in a championship. |
| `playerDashboard.upcomingMatches.title` | Prochains matchs | Upcoming matches |
| `playerDashboard.upcomingMatches.empty` | Aucun match à venir | No upcoming matches |
| `playerDashboard.recentResults.title` | Derniers résultats | Recent results |
| `playerDashboard.recentResults.empty` | Aucun résultat récent | No recent results |
| `playerDashboard.recentResults.win` | V | W |
| `playerDashboard.recentResults.draw` | N | D |
| `playerDashboard.recentResults.loss` | D | L |
| `playerDashboard.standings.title` | Classement | Standings |
| `playerDashboard.standings.rank` | # | # |
| `playerDashboard.standings.team` | Équipe | Team |
| `playerDashboard.standings.played` | J | P |
| `playerDashboard.standings.won` | V | W |
| `playerDashboard.standings.drawn` | N | D |
| `playerDashboard.standings.lost` | D | L |
| `playerDashboard.standings.points` | Pts | Pts |

---

### Propagation workflow

```text
specifications/14-dashboard-player.md
  └─▶ backend/openapi.yml (GET /me/teams)
        ├─▶ pnpm gen:sdk → useGetMyTeams()
        └─▶ backend handler + tests unitaires
              └─▶ frontend usePlayerDashboard + PlayerRecentResults + PlayerAppSidebar
                    └─▶ tests filterRecentResults
```

---

## Vérification

| Étape | Commande |
|-------|----------|
| Types backend | `pnpm check:type` (depuis `backend/`) |
| Tests backend | `pnpm vitest run` (depuis `backend/`) |
| SDK régénéré | `pnpm --filter application-material gen:sdk` |
| Tests frontend | `pnpm --filter application-material test` |
| Lint | `npx eslint src/Dashboard src/I18n` (depuis `frontend/web-application/`) |
| Visuel | App avec `VITE_MOCKED_BACKEND=false` — vérifier PlayerTab + PlayerAppSidebar |
