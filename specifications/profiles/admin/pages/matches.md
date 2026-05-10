# Admin — Matchs

## URLs

| Page             | URL                        |
| ---------------- | -------------------------- |
| Liste            | `/matches`                 |
| Détail           | `/matches/:id`             |
| Modifier         | `/matches/:id/edit`        |

## Liste des matchs

- Tous les matchs (toutes phases, tous championnats)
- Filtres : par championnat, par phase, par statut (à venir / joué / forfait), par équipe
- Actions par ligne : Voir, Modifier

## Détail d'un match

### Informations

- Équipes (domicile / extérieur)
- Date, lieu
- Statut (à venir / en cours / terminé / forfait)
- Score (si saisi)
- Arbitre(s) assigné(s) avec bouton « Retirer »
- Bouton « Assigner un arbitre »

### Actions disponibles (Admin)

- Bouton « Modifier les métadonnées » (date, lieu)
- Bouton « Saisir / modifier le score »
- Bouton « Valider le score »
- Bouton « Déclarer un forfait » (avec sélecteur de l'équipe forfait)
- Bouton « Assigner un arbitre »

## Formulaire de saisie de score

- Champs : buts équipe domicile, buts équipe extérieur
- Confirmation avant soumission

## Formulaire de forfait

- Sélection de l'équipe qui déclare forfait
- Confirmation — action irréversible sans intervention admin

## Maquette — Liste

![Liste des matchs](./mockups/matches-list.png)

## Maquette — Détail

![Détail d'un match](./mockups/match-detail.png)
