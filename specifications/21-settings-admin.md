# Paramètres (Settings admin)

## Définition

La section Paramètres (`/app/settings`) est un espace de configuration regroupant les référentiels transverses utilisés par les autres domaines métier — lieux (Area), catégories d'âge (AgeCategory) et saisons (Season) à ce jour. Elle centralise l'administration de données qui ne sont pas rattachées à une équipe ou un championnat précis, mais consommées par plusieurs domaines.

---

## Acteurs concernés

| Rôle  | Implication                                                                                                |
| ----- | ---------------------------------------------------------------------------------------------------------- |
| Admin | Accès complet à toutes les sections (Lieux, Catégories d'âge, Saisons) — création/modification/suppression |
| Coach | Accès à la section Lieux uniquement, en modification (voir [[20-area]])                                    |

---

## Règles métier

### Navigation

La page d'accueil `/app/settings` (`MainSettingsPage`) affiche une grille de tuiles, une par section disponible. Le menu est calculé dynamiquement par `useSettingsMenu` :

- **Lieux** (`areas`) : toujours affiché, quel que soit le rôle (Admin ou Coach).
- **Catégories d'âge** (`age-categories`) : affiché uniquement si `user.isAdmin`.
- **Saisons** (`seasons`) : affiché uniquement si `user.isAdmin`.

Cliquer une tuile navigue vers la sous-route correspondante (`/app/settings/areas`, `/app/settings/age-categories`, `/app/settings/seasons`). `SettingsLayout` fournit le cadre commun (breadcrumb « Paramètres », `Outlet`).

### Accès aux sections

- `/app/settings/age-categories` et `/app/settings/seasons` sont protégées par `RequireRole` (`frontend/web-application/src/Auth/ui/RequireRole/RequireRole.tsx`) — redirige vers `/app` si `!user.isAdmin`. Même garde appliquée à tout `/app/admin/*`.
- L'affichage des tuiles dans le menu (`useSettingsMenu`) reste une barrière UX complémentaire (cache le lien avant même la navigation).
- La protection contre les écritures non autorisées reste aussi assurée par l'API : `POST`/`DELETE /age-categories`, `POST`/`DELETE /seasons` et `POST /areas` exigent Admin ; `PATCH /areas/:id` accepte Admin ou Coach (voir [[20-area]]).
- Un Coach qui accéderait directement à l'URL `/app/settings/age-categories` ou `/app/settings/seasons` est redirigé vers `/app` par `RequireRole`.

### Sections existantes

| Section          | Route                          | Référentiel utilisé par                                  |
| ---------------- | ------------------------------ | -------------------------------------------------------- |
| Lieux (Area)     | `/app/settings/areas`          | Match (lieu assigné), Team (terrains) — voir [[20-area]] |
| Catégories d'âge | `/app/settings/age-categories` | Team, Championship — voir [[19-age-category]]            |
| Saisons          | `/app/settings/seasons`        | Championship — voir [[22-season]]                        |

> Doublon de route résolu (2026-07-19) : `/app/admin/age-categories` supprimé de `AppRouting.tsx` (aucun lien nulle part, seul `/app/settings/age-categories` était utilisé via `useSettingsMenu`).

---

## Matrice de permissions

| Action                                     | Admin | Coach |
| ------------------------------------------ | :---: | :---: |
| Voir le menu Paramètres                    |  ✅   |  ✅   |
| Voir la tuile Lieux                        |  ✅   |  ✅   |
| Voir la tuile Catégories d'âge             |  ✅   |  ❌   |
| Voir la tuile Saisons                      |  ✅   |  ❌   |
| Modifier un lieu                           |  ✅   |  ✅   |
| Créer / supprimer un lieu                  |  ✅   |  ❌   |
| Créer / modifier / supprimer une catégorie |  ✅   |  ❌   |
| Créer / modifier / archiver une saison     |  ✅   |  ❌   |

---

## Cas limites et contraintes

- `RequireRole` couvre `/app/settings/age-categories`, `/app/settings/seasons` et tout `/app/admin/*` (route guard générique, redirige vers `/app`) — voir commit `29fbaf4`.
- L'ajout d'une nouvelle section au menu (`useSettingsMenu`) doit être accompagné de la mise à jour de la matrice de permissions ci-dessus et du guide API correspondant. Si la section est admin-only, envelopper sa route avec `RequireRole`.

---

## Questions ouvertes

- Prochaines sections envisagées pour `/app/settings` : aucune à ce jour — périmètre limité à Lieux, Catégories d'âge et Saisons.
