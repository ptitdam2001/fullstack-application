# Coach — Équipes

## URLs

| Page         | URL               |
| ------------ | ----------------- |
| Liste        | `/teams`          |
| Détail       | `/teams/:id`      |

## Liste des équipes

- Toutes les équipes (lecture seule pour les autres)
- Ses propres équipes mises en avant avec badge « Mon équipe »
- Filtre « Mes équipes » disponible
- Pas de bouton « Créer une équipe »

## Détail — Autre équipe (pas la sienne)

- Informations : nom, couleur, terrain, championship
- Liste des joueurs (lecture seule)
- Coach(s) assigné(s) (lecture seule)
- Aucun bouton de modification

## Détail — Sa propre équipe

### Informations

- Nom, couleur, terrain
- Bouton « Modifier l'équipe » → formulaire de modification (nom, couleur, terrain)

### Joueurs

- Liste des joueurs : nom, maillot, poste
- Bouton « Modifier le profil joueur » par joueur (maillot, poste)
- Bouton « Retirer de l'équipe » par joueur

### Match de son équipe

- Bouton « Déclarer un forfait » visible sur les matchs à venir de son équipe
  - Confirmation requise — irréversible sans intervention admin

## Maquette — Liste

![Liste des équipes (Coach)](./mockups/teams-list.png)

## Maquette — Détail équipe (la sienne)

![Détail équipe Coach](./mockups/team-detail-own.png)
