# Profil Arbitre — Vue d'ensemble

## Description

Officiel désigné pour un ou plusieurs matchs via `UserMatch`. Accès en lecture sur toutes les données publiques. Peut saisir et valider les scores des matchs qui lui sont assignés.

## Redirection après login

`/dashboard`

## Navigation disponible

| Entrée              | URL              |
| ------------------- | ---------------- |
| Tableau de bord     | `/dashboard`     |
| Championnats        | `/championships` |
| Équipes             | `/teams`         |
| Matchs              | `/matches`       |
| Mes matchs          | `/my-matches`    |
| Mon profil          | `/profile`       |

## Accès global

| Domaine                        | Lecture | Création | Modification | Suppression |
| ------------------------------ | :-----: | :------: | :----------: | :---------: |
| Championnats                   | ✅      | ❌       | ❌           | ❌          |
| Équipes                        | ✅      | ❌       | ❌           | ❌          |
| Matchs (tous)                  | ✅      | ❌       | ❌           | ❌          |
| Scores (ses matchs)            | ✅      | ✅       | ✅           | —           |
| Scores (autres)                | ✅      | ❌       | ❌           | —           |
| Forfait (pendant son match)    | —       | ✅       | —            | —           |
| Utilisateurs                   | ❌      | ❌       | ❌           | ❌          |
| Classements                    | ✅      | —        | —            | —           |

## Règles contextuelles

- Saisie/validation de score limitée aux matchs où `UserMatch(userId, matchId)` existe
- **Forfait** : l'arbitre peut constater et enregistrer le forfait d'une équipe uniquement **pendant le match** (match à statut `IN_PROGRESS` ou équivalent). Il ne peut pas déclarer forfait avant le coup d'envoi — c'est le coach ou l'admin qui le font en amont.
- Un arbitre peut être assigné à plusieurs matchs simultanément
- Un match peut avoir plusieurs arbitres
- Entrée nav « Mes matchs » exclusive à ce profil
