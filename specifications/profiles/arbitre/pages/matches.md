# Arbitre — Matchs (globaux)

## URL

`/matches`

## Description

Vue globale de tous les matchs. Lecture seule — la saisie de score se fait uniquement via `/my-matches`.

## Liste des matchs

- Tous les matchs (tous championnats, toutes phases)
- Ses matchs assignés mis en avant avec badge « Arbitre »
- Filtres : par championnat, par phase, par statut
- Aucun bouton de saisie de score (redirige vers « Mes matchs »)

## Détail d'un match (global)

- Informations : équipes, date, lieu, statut, score, arbitres
- Si ce match lui est assigné : lien « Gérer ce match » → `/my-matches/:id`
- Aucune action directe de saisie de score sur cette page

## Maquette

![Liste des matchs (Arbitre)](./mockups/matches-list.png)
