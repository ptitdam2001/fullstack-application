# Coach — Matchs

## URL

`/matches`

## Description

Accès en lecture seule sur tous les matchs. Filtre « Mes équipes » activé par défaut pour mettre en avant les matchs pertinents.

## Liste des matchs

- Tous les matchs, filtre « Mes équipes » activé par défaut
- Matchs de ses équipes mis en avant (badge « Mon équipe »)
- Filtres disponibles : par championnat, par phase, par statut
- Aucun bouton de création ou de modification

## Détail d'un match

- Informations : équipes, date, lieu, statut, score, arbitres
- Si le match implique une de ses équipes et est **à venir** (statut `SCHEDULED`) :
  - Bouton « Déclarer un forfait » (pré-match — avant le coup d'envoi)
  - Sélecteur : « Forfait pour [Nom de son équipe] »
  - Confirmation requise — action irréversible sans intervention admin
  - Bouton masqué si le match est déjà en cours ou terminé
- Aucune saisie de score possible

## Maquette — Liste

![Liste des matchs (Coach)](./mockups/matches-list.png)

## Maquette — Détail

![Détail d'un match (Coach)](./mockups/match-detail.png)
