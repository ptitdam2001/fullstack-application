# Profil Coach — Vue d'ensemble

## Description

Responsable d'une ou plusieurs équipes. Identifié par un enregistrement `UserTeam(COACH, teamId)`. Peut modifier ses propres équipes, gérer leurs joueurs, et déclarer forfait pour un match impliquant son équipe. Accès en lecture seule sur tout le reste.

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

| Domaine              | Lecture | Création | Modification            | Suppression |
| -------------------- | :-----: | :------: | :---------------------: | :---------: |
| Championnats         | ✅      | ❌       | ❌                      | ❌          |
| Équipes (autres)     | ✅      | ❌       | ❌                      | ❌          |
| Ses équipes          | ✅      | ✅ (devient coach) | ✅ (infos + joueurs) | ❌       |
| Matchs               | ✅      | ❌       | ❌                      | ❌          |
| Forfait (son équipe) | —       | ✅       | —                       | —           |
| Scores               | ✅      | ❌       | ❌                      | —           |
| Utilisateurs         | ❌      | ❌       | ❌                      | ❌          |
| Classements          | ✅      | —        | —                       | —           |

## Règles contextuelles

- Les droits d'écriture sont vérifiés en DB via `UserTeamUseCases.hasRole(userId, teamId, COACH)`
- Un coach sans équipe associée a accès en lecture seule uniquement
- Plusieurs équipes possibles simultanément — droits appliqués équipe par équipe
- **Création d'équipe** : tout utilisateur authentifié peut créer une équipe — il en devient automatiquement coach (`UserTeam(COACH, teamId)` créé à la suite de la création).
- **Forfait** : un coach peut déclarer forfait uniquement pour un match où l'une de ses équipes est participante (`homeTeamId` ou `awayTeamId` ∈ ses équipes). La déclaration est irréversible sans intervention admin.
