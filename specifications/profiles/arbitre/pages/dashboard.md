# Arbitre — Tableau de bord

## URL

`/dashboard`

## Description

Page d'accueil après login. Vue centrée sur les matchs assignés à l'arbitre.

## Contenu affiché

### Mes prochains matchs

- Liste des matchs où il est assigné, triés par date
- Informations : date, équipes, lieu
- Lien vers le détail du match (saisie de score)
- Badge de statut : à venir / score à saisir / terminé

### Matchs récents

- Matchs passés avec score déjà saisi/validé (lecture seule)

### Message si aucun match assigné

« Vous n'êtes assigné à aucun match pour le moment. »

## Actions disponibles

- Clic sur un match → `/my-matches/:id` (accès score)

## Maquette

![Tableau de bord Arbitre](./mockups/dashboard.png)
