# Profil Joueur — Vue d'ensemble

## Description

Participant inscrit dans une équipe via `UserTeam(PLAYER, teamId)`. Possède un profil joueur (`Player`) avec numéro de maillot et poste. Accès en lecture seule sur toute la plateforme.

## Redirection après login

`/dashboard`

## Navigation disponible

| Entrée              | URL               |
| ------------------- | ----------------- |
| Tableau de bord     | `/dashboard`      |
| Championnats        | `/championships`  |
| Équipes             | `/teams`          |
| Matchs              | `/matches`        |
| Mon profil          | `/profile`        |

## Accès global

| Domaine        | Lecture | Création | Modification | Suppression |
| -------------- | :-----: | :------: | :----------: | :---------: |
| Championnats   | ✅      | ❌       | ❌           | ❌          |
| Équipes        | ✅      | ❌       | ❌           | ❌          |
| Matchs         | ✅      | ❌       | ❌           | ❌          |
| Scores         | ✅      | ❌       | ❌           | —           |
| Utilisateurs   | ❌      | ❌       | ❌           | ❌          |
| Classements    | ✅      | —        | —            | —           |

## Règles contextuelles

- Un joueur peut appartenir à plusieurs équipes simultanément
- Son profil joueur (maillot, poste) est visible mais modifiable uniquement par son coach ou l'admin
- Aucun bouton de création, modification ou suppression ne s'affiche dans l'interface
