# Dashboard — Architecture globale

## Définition

Le dashboard est la page d'accueil de l'application authentifiée, accessible via la route `/app`. Son contenu et son menu latéral s'adaptent dynamiquement au(x) rôle(s) de l'utilisateur connecté.

---

## Acteurs concernés

| Rôle                              | Comportement                                                         |
| --------------------------------- | -------------------------------------------------------------------- |
| Admin                             | Dashboard dédié standalone (KPIs système + live feed)                |
| Coach                             | Onglet "Coach" dans le dashboard multi-rôles                         |
| Joueur                            | Onglet "Joueur" dans le dashboard multi-rôles                        |
| Arbitre                           | Onglet "Arbitre" dans le dashboard multi-rôles                       |
| Multi-rôles (ex: Coach + Arbitre) | Plusieurs onglets, chacun dédié à un rôle                            |
| Utilisateur sans équipe           | Dashboard minimal (lecture seule, invitation à rejoindre une équipe) |

---

## Architecture de sélection du dashboard

### Règle de dispatch

```ts
user.isAdmin === true
  → AdminDashboard (standalone, sans onglets)

sinon
  → DashboardTabs (onglets filtrés par rôles actifs)
```

L'admin ne peut pas cumuler d'autres vues dans le dashboard — son dashboard est distinct par nature.

### Détection des rôles actifs (non-admin)

Les rôles sont dérivés des champs `User.roles[]` (liste fournie par `/auth/me`) :

| Rôle détecté           | Onglet affiché |
| ---------------------- | -------------- |
| `COACH` dans `roles`   | Tab "Coach"    |
| `PLAYER` dans `roles`  | Tab "Joueur"   |
| `REFEREE` dans `roles` | Tab "Arbitre"  |

Si aucun rôle contextuel (`roles` vide ou absent) → affichage d'un état vide avec invitation à rejoindre une équipe.

### Ordre et onglet par défaut

Ordre fixe des onglets : **Coach → Joueur → Arbitre**

L'onglet actif par défaut est le **premier onglet présent** selon cet ordre. Exemple : un utilisateur REFEREE + PLAYER voit l'onglet "Joueur" actif par défaut.

---

## Architecture du menu latéral

### Règle de sélection de la sidebar

La sidebar est **stable et indépendante des onglets** du dashboard. Elle est sélectionnée une seule fois selon le rôle dominant :

```ts
user.isAdmin === true        → AdminAppSidebar
user.roles.includes('COACH') → CoachAppSidebar
user.roles.includes('PLAYER') → PlayerAppSidebar (ou sidebar générique)
user.roles.includes('REFEREE') → sidebar générique
sinon                        → sidebar générique
```

**Rôle dominant** (ordre de priorité pour la sidebar) : Admin > Coach > Joueur > Arbitre

La sidebar ne change pas lorsque l'utilisateur switch d'onglet dans le dashboard.

---

## Polling global

Les données du dashboard sont rafraîchies automatiquement via TanStack Query.

| Paramètre           | Valeur par défaut                                            |
| ------------------- | ------------------------------------------------------------ |
| Interval de polling | 30 secondes                                                  |
| Configurable        | Via constante `DASHBOARD_POLLING_INTERVAL_MS` dans `config/` |

Tous les widgets du dashboard utilisant `refetchInterval` référencent cette constante. Un seul endroit à modifier pour changer la cadence.

---

## Section technique

### Fichiers impactés

| Fichier                                  | Rôle                                      |
| ---------------------------------------- | ----------------------------------------- |
| `src/Application/pages/Dashboard.tsx`    | Dispatch AdminDashboard vs DashboardTabs  |
| `src/Layouts/components/AppSidebar.tsx`  | Dispatch sidebar par rôle dominant        |
| `src/Dashboard/ui/`                      | Composants de chaque dashboard            |
| `config/dashboard.config.ts` _(à créer)_ | Constante `DASHBOARD_POLLING_INTERVAL_MS` |

### Constante de polling

```typescript
// config/dashboard.config.ts
export const DASHBOARD_POLLING_INTERVAL_MS = 30_000;
```

### Structure Dashboard.tsx

```tsx
export const Dashboard = () => {
  const { user } = AuthProvider.useAuthValue();

  if (!user) {
    return <PageLoader />;
  }
  if (user.isAdmin) {
    return <AdminDashboard />;
  }
  return <DashboardTabs roles={user.roles ?? []} />;
};
```

### Structure DashboardTabs

```typescript
// Onglets construits dynamiquement selon les rôles présents
const ROLE_TAB_ORDER = ["COACH", "PLAYER", "REFEREE"] as const;

// Filtre les rôles actifs en maintenant l'ordre fixe
const activeTabs = ROLE_TAB_ORDER.filter((role) => roles.includes(role));
```

### Données d'authentification

L'objet `user` provient de `AuthProvider.useAuthValue()`. Les rôles (`user.roles`) sont renseignés par le backend via `/auth/me` et correspondent aux entrées `UserTeam` et `UserMatch` de l'utilisateur.

> **Limite connue** : `user.isAdmin` est un booléen sur `User`. Les rôles contextuels (COACH, PLAYER, REFEREE) sont dans `user.roles[]`. Ces deux sources doivent être utilisées conjointement pour le dispatch.
