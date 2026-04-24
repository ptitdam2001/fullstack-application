# Profils utilisateurs

## Modèle de rôles

Le modèle distingue deux niveaux de rôles :

### Niveau système — `User.isAdmin`

`isAdmin: boolean` sur l'entité `User`. Un admin gère la plateforme dans son ensemble. C'est le seul privilège global ; tous les autres rôles sont **contextuels**.

### Niveau contextuel — `UserTeam` et `UserMatch`

Les rôles COACH, PLAYER et REFEREE ne sont pas stockés sur `User` mais dans des tables de relation :

| Table       | Relation     | Rôle porté          |
| ----------- | ------------ | ------------------- |
| `UserTeam`  | User ↔ Team  | `COACH` ou `PLAYER` |
| `UserMatch` | User ↔ Match | Arbitre (implicite) |

---

## Use cases d'appartenance

Un même utilisateur peut cumuler plusieurs rôles sans conflit. Toutes ces combinaisons sont supportées :

| Use case | Enregistrements |
|---|---|
| Coach d'une équipe | `UserTeam(COACH, team-A)` |
| Joueur d'une équipe | `UserTeam(PLAYER, team-A)` + `Player` |
| Coach ET joueur de la **même** équipe | `UserTeam(COACH, team-A)` + `UserTeam(PLAYER, team-A)` + `Player` |
| Coach d'une équipe, joueur d'une autre | `UserTeam(COACH, team-A)` + `UserTeam(PLAYER, team-B)` + `Player` |
| Coach de plusieurs équipes | `UserTeam(COACH, team-A)` + `UserTeam(COACH, team-B)` |
| Arbitre d'un match | `UserMatch(match-1)` |
| Arbitre + coach d'une équipe | `UserMatch` + `UserTeam(COACH)` |
| Arbitre + joueur d'une équipe | `UserMatch` + `UserTeam(PLAYER)` + `Player` |
| Arbitre + joueur + coach d'équipes différentes | `UserMatch` + `UserTeam(PLAYER)` + `UserTeam(COACH)` + `Player` |
| Admin | `User.isAdmin = true` — aucun `UserTeam` requis |

> **Contrainte d'unicité** : `UserTeam` a `@@unique([userId, teamId, role])`. Un utilisateur peut être COACH et PLAYER de la même équipe simultanément, mais pas COACH deux fois de la même équipe.

---

## Définitions

### Admin

Gestionnaire de la plateforme. Accès complet en lecture et écriture sur toutes les entités. Seul capable de créer des utilisateurs, d'assigner des arbitres à des matchs et d'associer des coachs ou joueurs à des équipes.

### Coach

Responsable d'une ou plusieurs équipes. Identifié par un enregistrement `UserTeam(COACH, teamId)`. Accès en lecture sur toutes les données. Accès en écriture limité aux joueurs des équipes dont il est coach — vérifié en base de données à chaque opération.

### Joueur

Participant inscrit dans une équipe via `UserTeam(PLAYER, teamId)`. Possède un profil joueur (`Player`) avec numéro de maillot et poste. Un utilisateur peut être joueur dans plusieurs équipes (un `UserTeam(PLAYER)` + `Player` par équipe). Accès en lecture seule.

### Arbitre

Officiel désigné pour un ou plusieurs matchs via `UserMatch`. Accès en lecture sur toutes les données publiques. Peut saisir et valider les scores des matchs qui lui sont assignés.

---

## Matrice de permissions

### Gestion des utilisateurs

| Action                  | Admin | Coach | Arbitre | Joueur |
| ----------------------- | ----- | ----- | ------- | ------ |
| Lister les utilisateurs | ✅    | ❌    | ❌      | ❌     |
| Créer un utilisateur    | ✅    | ❌    | ❌      | ❌     |
| Modifier un utilisateur | ✅    | ❌    | ❌      | ❌     |
| Supprimer un utilisateur| ✅    | ❌    | ❌      | ❌     |
| Voir son propre profil  | ✅    | ✅    | ✅      | ✅     |

### Championnats

| Action             | Admin | Coach | Arbitre | Joueur |
| ------------------ | ----- | ----- | ------- | ------ |
| Lister / consulter | ✅    | ✅    | ✅      | ✅     |
| Créer              | ✅    | ❌    | ❌      | ❌     |
| Modifier           | ✅    | ❌    | ❌      | ❌     |
| Supprimer          | ✅    | ❌    | ❌      | ❌     |

### Équipes

| Action                                | Admin | Coach (son équipe) | Coach (autre) | Arbitre | Joueur |
| ------------------------------------- | ----- | ------------------ | ------------- | ------- | ------ |
| Lister / consulter                    | ✅    | ✅                 | ✅            | ✅      | ✅     |
| Créer                                 | ✅    | ❌                 | ❌            | ❌      | ❌     |
| Modifier                              | ✅    | ❌                 | ❌            | ❌      | ❌     |
| Supprimer                             | ✅    | ❌                 | ❌            | ❌      | ❌     |
| Voir les joueurs d'une équipe         | ✅    | ✅                 | ✅            | ✅      | ✅     |
| Gérer les joueurs d'une équipe        | ✅    | ✅                 | ❌            | ❌      | ❌     |
| Assigner un coach à une équipe        | ✅    | ❌                 | ❌            | ❌      | ❌     |

> La vérification "son équipe" est effectuée en DB via `UserTeamUseCases.hasRole(userId, teamId, COACH)` dans le use case.

### Matchs

| Action                              | Admin | Coach | Arbitre (assigné) | Joueur |
| ----------------------------------- | ----- | ----- | ----------------- | ------ |
| Lister / consulter                  | ✅    | ✅    | ✅                | ✅     |
| Créer / générer                     | ✅    | ❌    | ❌                | ❌     |
| Modifier les métadonnées            | ✅    | ❌    | ❌                | ❌     |
| Saisir le score                     | ✅    | ❌    | ✅                | ❌     |
| Valider le score                    | ✅    | ❌    | ✅                | ❌     |
| Déclarer un forfait                 | ✅    | ❌    | ❌                | ❌     |
| Assigner un arbitre                 | ✅    | ❌    | ❌                | ❌     |

> Un arbitre ne peut saisir un score que pour les matchs où il a un enregistrement `UserMatch(userId, matchId)`.
> Un match peut avoir plusieurs arbitres.

### Classements

| Action                    | Admin | Coach | Arbitre | Joueur |
| ------------------------- | ----- | ----- | ------- | ------ |
| Consulter les classements | ✅    | ✅    | ✅      | ✅     |

---

## Règles d'assignation

### Coach ↔ Équipe

- Un coach peut gérer **plusieurs équipes** simultanément.
- L'association est créée et supprimée exclusivement par un Admin via `POST/DELETE /team/{teamId}/coach/{userId}`.
- Un coach sans équipe associée a accès en lecture seule.

### Joueur ↔ Équipe

- Un joueur peut appartenir à **plusieurs équipes** (un `UserTeam(PLAYER)` + `Player` par équipe).
- Un utilisateur peut être COACH et PLAYER de la **même** équipe.
- Le profil `Player` stocke uniquement le numéro de maillot et le poste (prénom, nom, avatar proviennent de `User`).

### Arbitre ↔ Match

- Un arbitre peut être assigné à **plusieurs matchs**.
- Un match peut avoir **plusieurs arbitres**.
- L'assignation est réalisée exclusivement par un Admin via `POST /match/{matchId}/referee/{userId}`.
- Un match sans arbitre voit son score saisi par un Admin.

---

## Contraintes de sécurité

- Toutes les routes requièrent un JWT valide (sauf `POST /login` et `POST /forgot-password`).
- Les vérifications de propriété (coach → son équipe, arbitre → son match) sont effectuées dans les use cases via les repositories `UserTeam` et `UserMatch`.
- Token absent ou expiré → `401 Unauthorized`.
- Droits insuffisants → `403 Forbidden`.
