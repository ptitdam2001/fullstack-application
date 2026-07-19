# Paramètres (Settings admin)

## Définition

La section Paramètres (`/app/settings`) est un espace de configuration regroupant les référentiels transverses utilisés par les autres domaines métier — lieux (Area) et catégories d'âge (AgeCategory) à ce jour. Elle centralise l'administration de données qui ne sont pas rattachées à une équipe ou un championnat précis, mais consommées par plusieurs domaines.

---

## Acteurs concernés

| Rôle  | Implication                                                                                       |
| ----- | ------------------------------------------------------------------------------------------------- |
| Admin | Accès complet à toutes les sections (Lieux, Catégories d'âge) — création/modification/suppression |
| Coach | Accès à la section Lieux uniquement, en modification (voir [[20-area]])                           |

---

## Règles métier

### Navigation

La page d'accueil `/app/settings` (`MainSettingsPage`) affiche une grille de tuiles, une par section disponible. Le menu est calculé dynamiquement par `useSettingsMenu` :

- **Lieux** (`areas`) : toujours affiché, quel que soit le rôle (Admin ou Coach).
- **Catégories d'âge** (`age-categories`) : affiché uniquement si `user.isAdmin`.

Cliquer une tuile navigue vers la sous-route correspondante (`/app/settings/areas`, `/app/settings/age-categories`). `SettingsLayout` fournit le cadre commun (breadcrumb « Paramètres », `Outlet`).

### Accès aux sections

- L'affichage des tuiles dans le menu est **la seule barrière** appliquée côté frontend (pas de garde de route par rôle sur `/app/settings/age-categories`).
- La protection réelle contre les écritures non autorisées est assurée par l'API : `POST`/`DELETE /age-categories` et `POST /areas` exigent Admin ; `PATCH /areas/:id` accepte Admin ou Coach (voir [[20-area]]).
- Un Coach qui accéderait directement à l'URL `/app/settings/age-categories` verrait la page (lecture), mais toute tentative d'écriture serait rejetée par le backend (403).

### Sections existantes

| Section          | Route                          | Référentiel utilisé par                                  |
| ---------------- | ------------------------------ | -------------------------------------------------------- |
| Lieux (Area)     | `/app/settings/areas`          | Match (lieu assigné), Team (terrains) — voir [[20-area]] |
| Catégories d'âge | `/app/settings/age-categories` | Team, Championship — voir [[19-age-category]]            |

> Doublon de route résolu (2026-07-19) : `/app/admin/age-categories` supprimé de `AppRouting.tsx` (aucun lien nulle part, seul `/app/settings/age-categories` était utilisé via `useSettingsMenu`).

---

## Matrice de permissions

| Action                                     | Admin | Coach |
| ------------------------------------------ | :---: | :---: |
| Voir le menu Paramètres                    |  ✅   |  ✅   |
| Voir la tuile Lieux                        |  ✅   |  ✅   |
| Voir la tuile Catégories d'âge             |  ✅   |  ❌   |
| Modifier un lieu                           |  ✅   |  ✅   |
| Créer / supprimer un lieu                  |  ✅   |  ❌   |
| Créer / modifier / supprimer une catégorie |  ✅   |  ❌   |

---

## Cas limites et contraintes

- Aucune garde de route (`CheckAuthentication` couvre uniquement l'authentification, pas les rôles) ne protège `/app/settings/age-categories` côté frontend — un Coach connecté peut atteindre la page via URL directe même si la tuile est masquée. Sans conséquence fonctionnelle actuelle car le backend rejette les écritures, mais la page reste consultable en lecture.
- L'ajout d'une nouvelle section au menu (`useSettingsMenu`) doit être accompagné de la mise à jour de la matrice de permissions ci-dessus et du guide API correspondant.

---

## Questions ouvertes

- Faut-il ajouter une garde de route par rôle sur `/app/settings/age-categories`, ou le filtrage du menu + la protection API suffisent-ils ? Aucun composant `RequireRole`/garde par rôle n'existe dans le code actuel — `/app/admin/*` a le même trou (choix de rendu sidebar dans `AppSidebar.tsx`, pas de garde sur les Routes).
- Prochaines sections envisagées pour `/app/settings` : aucune à ce jour — périmètre limité à Lieux et Catégories d'âge.
