# Admin — Championnats

## URLs

| Page                   | URL                              |
| ---------------------- | -------------------------------- |
| Liste                  | `/championships`                 |
| Détail                 | `/championships/:id`             |
| Créer                  | `/championships/new`             |
| Modifier               | `/championships/:id/edit`        |
| Phases                 | `/championships/:id/phases`      |
| Classement d'une poule | `/championships/:id/standings`   |

## Liste des championnats

- Tous les championnats (toutes catégories d'âge, tous statuts)
- Bouton « Créer un championnat »
- Actions par ligne : Modifier, Supprimer

## Détail d'un championnat

- Informations : nom, catégorie d'âge, saison, configuration des points
- Liste des phases avec leur type (GROUP / KNOCKOUT)
- Bouton « Ajouter une phase »
- Bouton « Générer les matchs » (par phase)
- Bouton « Modifier »
- Bouton « Supprimer »

## Formulaire de création / modification

- Champs : nom, catégorie d'âge, saison, points victoire/nul/défaite/forfait
- Validation côté client (zod) + côté serveur

## Maquette — Liste

![Liste des championnats](./mockups/championships-list.png)

## Maquette — Détail

![Détail d'un championnat](./mockups/championship-detail.png)
