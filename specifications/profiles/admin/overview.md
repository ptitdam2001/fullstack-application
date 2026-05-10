# Profil Admin — Vue d'ensemble

## Description

Gestionnaire de la plateforme. Accès complet en lecture et en écriture sur toutes les entités. Seul profil capable de créer des championnats, des équipes, des utilisateurs, et d'assigner les rôles contextuels (coach, arbitre).

## Redirection après login

`/dashboard`

## Navigation disponible

| Entrée              | URL               |
| ------------------- | ----------------- |
| Tableau de bord     | `/dashboard`      |
| Championnats        | `/championships`  |
| Équipes             | `/teams`          |
| Matchs              | `/matches`        |
| Utilisateurs        | `/users`          |
| Mon profil          | `/profile`        |

## Accès global

> Détail complet dans `06-user-profiles.md` — matrice de permissions.

| Domaine        | Lecture | Création | Modification | Suppression |
| -------------- | :-----: | :------: | :----------: | :---------: |
| Championnats   | ✅      | ✅       | ✅           | ✅          |
| Équipes        | ✅      | ✅       | ✅           | ✅          |
| Joueurs        | ✅      | ✅       | ✅           | ✅          |
| Matchs         | ✅      | ✅       | ✅           | ✅          |
| Scores         | ✅      | ✅       | ✅           | —           |
| Utilisateurs   | ✅      | ✅       | ✅           | ✅          |
| Classements    | ✅      | —        | —            | —           |

## Actions exclusives Admin

- Créer / supprimer un championnat
- Créer / supprimer une équipe
- Générer les matchs d'une phase
- Déclarer un forfait
- Assigner un arbitre à un match
- Assigner / retirer un coach d'une équipe
- Créer / modifier / supprimer un utilisateur
- Promouvoir / rétrograder admin
