# Gestion des équipes — Admin

## Définition

Page d'administration permettant à un admin de visualiser, créer, modifier et supprimer les équipes du système. Accessible via `/app/admin/teams`.

> Voir `specifications/04-team.md` pour les règles métier des équipes (couleur, venue, soft delete, permissions).

---

## Acteurs concernés

| Rôle              | Accès                                                        |
| ----------------- | ------------------------------------------------------------ |
| Admin             | Accès complet (lecture, création, modification, suppression) |
| Tous autres rôles | Pas d'accès — redirigés via `CheckAuthentication`            |

---

## Fonctionnalités

### 1. Liste des équipes (tableau)

Affichage des équipes sous forme de tableau paginé (25 lignes par page).

| Colonne         | Donnée                                          |
| --------------- | ----------------------------------------------- |
| Couleur         | Pastille colorée (`team.color`) ou `—` si null  |
| Nom             | `team.name`                                     |
| Catégorie d'âge | Badge `team.ageCategory` ou `—` si non défini   |
| Lieu            | Nom du premier `area` ou `—` si pas de venue    |
| Actions         | Boutons Modifier (Pencil) et Supprimer (Trash2) |

#### Comportement

- Pagination via `TablePagination` (25 lignes/page, affichage du nombre total)
- Données chargées via `GET /teams` (paginé) + `GET /teams/count`
- Chargement : skeleton table (`TableLoader`)
- Erreur : `ErrorBoundary` avec message générique

### 2. Création d'une équipe

- Accessible via le bouton "Nouvelle équipe" dans le header → navigue vers `/app/admin/teams/create`
- Dialog modal URL-based contenant `CreateTeamForm` existant (champs : nom + couleur)
- Fermeture du dialog → retour à la liste (`navigate(-1)`)
- Succès → toast de confirmation + retour à la liste
- Le formulaire existant gère la validation via zod (`CreateTeamBody`)

### 3. Modification d'une équipe

- Accessible via le bouton Pencil (modifier) sur chaque ligne → navigue vers `/app/admin/teams/:teamId/edit`
- Dialog modal URL-based contenant `UpdateTeamForm` existant (champs : nom + couleur + areas)
- Pré-chargement des données via `useTeamDetail(teamId)`
- Fermeture du dialog → retour à la liste
- Succès → toast de confirmation + retour à la liste

### 4. Suppression d'une équipe

- Accessible via le bouton Trash2 (supprimer) sur chaque ligne → navigue vers `/app/admin/teams/:teamId/delete`
- Dialog de confirmation URL-based affichant :
  - Titre : "Supprimer l'équipe"
  - Description : "Êtes-vous sûr de vouloir supprimer l'équipe « {teamName} » ? Cette action est irréversible."
  - Bouton "Annuler" → ferme le dialog
  - Bouton "Supprimer" (destructif) → appelle `DELETE /team/:id`
- État de chargement : spinner sur le bouton Supprimer pendant la requête
- Succès → toast "Équipe supprimée" + retour à la liste
- Erreur → toast "Erreur lors de la suppression"

> Rappel : la suppression est **logique** (soft delete). L'historique des matchs et classements est préservé (cf. `04-team.md`).

---

## URLs partageables

Toutes les actions CRUD sont accessibles via URL directe :

| Action      | URL                               |
| ----------- | --------------------------------- |
| Liste       | `/app/admin/teams`                |
| Création    | `/app/admin/teams/create`         |
| Édition     | `/app/admin/teams/:teamId/edit`   |
| Suppression | `/app/admin/teams/:teamId/delete` |

Les dialogs create/edit/delete sont des sous-routes rendues via `<Outlet />` dans `AdminTeamsPage`.

---

## Contraintes métier (rappel de 04-team.md)

- Le nom d'une équipe est unique au sein d'un championnat
- La couleur est obligatoire
- Seuls les Admins peuvent supprimer une équipe
- Les Admins et les Coachs de l'équipe peuvent modifier une équipe
- La suppression est logique (soft delete) — l'historique est préservé

---

## Section technique

### Routes API existantes (aucune modification backend)

| Route          | Méthode | Operation ID | Description                  |
| -------------- | ------- | ------------ | ---------------------------- |
| `/teams`       | GET     | getTeams     | Liste paginée (page, limit)  |
| `/teams/count` | GET     | countTeams   | Nombre total d'équipes       |
| `/team`        | POST    | createTeam   | Créer une équipe             |
| `/team/{id}`   | GET     | getTeam      | Détail d'une équipe          |
| `/team/{id}`   | PATCH   | updateTeam   | Modifier (Admin ou Coach)    |
| `/team/{id}`   | DELETE  | removeTeam   | Supprimer (Admin uniquement) |

### Architecture frontend

```text
src/Teams/
├── infrastructure/
│   └── useTeamApi.ts              # Ajouter: useRemoveTeam
├── application/
│   └── useTeamDelete.ts           # Nouveau: hook de suppression avec invalidation cache
├── ui/Admin/
│   ├── AdminTeamTable.tsx         # Tableau des équipes
│   ├── AdminTeamTableRow.tsx      # Ligne individuelle avec actions
│   └── ConfirmDeleteDialog.tsx    # Dialog de confirmation de suppression
└── domain/
    └── Team.ts                    # Existant (types re-exportés depuis SDK)

src/Admin/pages/
├── AdminTeamsPage.tsx             # Page principale (remplace le placeholder)
├── AdminTeamCreatePage.tsx        # Dialog create URL-based
├── AdminTeamEditPage.tsx          # Dialog edit URL-based
└── AdminTeamDeletePage.tsx        # Dialog delete URL-based
```

### Hooks réutilisés

| Hook            | Source                   | Usage                              |
| --------------- | ------------------------ | ---------------------------------- |
| `useTeamList`   | `src/Teams/application/` | Liste paginée (paramètre 25/page)  |
| `useTeamForm`   | `src/Teams/application/` | Mutations create/update            |
| `useTeamDetail` | `src/Teams/application/` | Chargement détail pour edit/delete |

### Nouveau hook : `useTeamDelete`

```typescript
export const useTeamDelete = () => {
  const deleteMutation = useRemoveTeam({
    mutation: {
      meta: { invalidates: [getGetTeamsQueryKey(), getCountTeamsQueryKey()] },
    },
  });

  return {
    deleteTeam: (teamId: string) => deleteMutation.mutateAsync({ id: teamId }),
    isPending: deleteMutation.isPending,
    isSuccess: deleteMutation.isSuccess,
    isError: deleteMutation.isError,
  };
};
```

### Composants réutilisés

| Composant         | Source                   | Usage                              |
| ----------------- | ------------------------ | ---------------------------------- |
| `Table.*`         | `@Common/Table/Table`    | Conteneur, header, body, row, cell |
| `TablePagination` | `@Common/Table/`         | Pagination en footer               |
| `TableLoader`     | `@Common/Loading`        | Skeleton pendant le chargement     |
| `ErrorBoundary`   | `@Common/ErrorBoundary`  | Gestion d'erreur                   |
| `Layout.*`        | `@repo/design-system`    | Root, Header, Content              |
| `Dialog*`         | `@repo/design-system`    | Dialogs modaux                     |
| `Button`          | `@repo/design-system`    | Boutons actions                    |
| `CreateTeamForm`  | `src/Teams/ui/TeamForm/` | Formulaire de création             |
| `UpdateTeamForm`  | `src/Teams/ui/TeamForm/` | Formulaire de modification         |

### Routing

```tsx
<Route path="admin" handle={{ breadcrumb: "Administration" }}>
  {/* ... autres routes admin ... */}
  <Route
    path="teams"
    element={<AdminTeamsPage />}
    handle={{ breadcrumb: "Équipes" }}
  >
    <Route
      path="create"
      element={<AdminTeamCreatePage />}
      handle={{ breadcrumb: "Créer" }}
    />
    <Route
      path=":teamId/edit"
      element={<AdminTeamEditPage />}
      handle={{ breadcrumb: "Modifier" }}
    />
    <Route
      path=":teamId/delete"
      element={<AdminTeamDeletePage />}
      handle={{ breadcrumb: "Supprimer" }}
    />
  </Route>
</Route>
```

### Diagramme de séquence — Suppression

```text
Admin → AdminTeamsPage → click Trash2 → navigate(/app/admin/teams/:id/delete)
  → AdminTeamDeletePage (Dialog URL-based)
    → useTeamDetail(teamId) → GET /team/:id → affiche nom
    → Admin click "Supprimer"
      → useTeamDelete().deleteTeam(id) → DELETE /team/:id
        → 200 OK → invalidate [teams, count] → toast "Équipe supprimée" → navigate(-1)
        → Error → toast "Erreur lors de la suppression"
    → Admin click "Annuler" ou ferme dialog → navigate(-1)
```
