# Admin — Équipes

## URLs

| Page             | URL                        |
| ---------------- | -------------------------- |
| Liste            | `/teams`                   |
| Détail           | `/teams/:id`               |
| Créer            | `/teams/new`               |
| Modifier         | `/teams/:id/edit`          |

## Liste des équipes

- Toutes les équipes (tous championnats)
- Filtres : par championnat, par catégorie d'âge
- Bouton « Créer une équipe »
- Actions par ligne : Voir, Modifier, Supprimer

## Détail d'une équipe

### Informations

- Nom, couleur, terrain
- Championnat(s) et catégorie d'âge
- Coach(s) assigné(s) avec bouton « Retirer »
- Bouton « Assigner un coach »

### Joueurs

- Liste des joueurs : nom, maillot, poste
- Bouton « Ajouter un joueur » (assigner un utilisateur existant)
- Actions par joueur : Modifier le profil joueur, Retirer de l'équipe

### Actions sur l'équipe

- Bouton « Modifier l'équipe »
- Bouton « Supprimer l'équipe »

## Formulaire de création / modification

- Champs : nom, couleur, terrain
- Sélecteur de championnat (assignation)

## Maquette — Liste

![Liste des équipes](./mockups/teams-list.png)

## Maquette — Détail

![Détail d'une équipe](./mockups/team-detail.png)
