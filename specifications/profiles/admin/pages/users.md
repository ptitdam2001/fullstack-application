# Admin — Utilisateurs

## URLs

| Page         | URL               |
| ------------ | ----------------- |
| Liste        | `/users`          |
| Détail       | `/users/:id`      |
| Créer        | `/users/new`      |
| Modifier     | `/users/:id/edit` |

## Liste des utilisateurs

- Tous les utilisateurs de la plateforme
- Colonnes : nom, prénom, email, rôles contextuels (coach/joueur/arbitre), admin
- Filtres : par rôle, par statut admin
- Bouton « Créer un utilisateur »
- Actions par ligne : Voir, Modifier, Supprimer

## Détail d'un utilisateur

- Informations personnelles : nom, prénom, email, avatar
- Flag `isAdmin` avec bouton toggle « Promouvoir admin » / « Rétrograder »
- Rôles contextuels :
  - Équipes où il est coach (liste avec lien)
  - Équipes où il est joueur (liste avec numéro et poste)
  - Matchs où il est arbitre (liste avec lien)
- Actions : Modifier, Supprimer

## Formulaire de création / modification

- Champs : prénom, nom, email, mot de passe (création uniquement)
- Checkbox « Admin »

## Maquette — Liste

![Liste des utilisateurs](./mockups/users-list.png)

## Maquette — Détail

![Détail d'un utilisateur](./mockups/user-detail.png)
