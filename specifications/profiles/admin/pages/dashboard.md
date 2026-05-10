# Admin — Tableau de bord

## URL

`/dashboard`

## Description

Page d'accueil après login. Vue globale de la plateforme avec indicateurs clés et alertes.

## Contenu affiché

### Indicateurs

- Nombre de championnats actifs
- Nombre total d'équipes
- Nombre de matchs à venir (7 prochains jours)
- Nombre de matchs sans arbitre assigné

### Alertes

- Matchs sans arbitre assigné : liste avec lien vers la page du match pour assigner
- Matchs passés sans score saisi : liste avec lien vers la page du match

### Accès rapide

- Bouton « Créer un championnat » → `/championships/new`
- Bouton « Créer une équipe » → `/teams/new`
- Bouton « Gérer les utilisateurs » → `/users`

## Maquette

![Tableau de bord Admin](./mockups/dashboard.png)

## Notes

Aucun filtre par défaut — l'admin voit tout.
