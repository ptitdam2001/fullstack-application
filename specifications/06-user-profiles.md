# Profils utilisateurs

## Rôles

L'application définit quatre rôles, activés progressivement.

| Rôle      | Statut                   |
| --------- | ------------------------ |
| `ADMIN`   | Actif                    |
| `COACH`   | Actif                    |
| `REFEREE` | Actif                    |
| `PLAYER`  | Prévu (évolution future) |

---

## Définitions

### Admin

Gestionnaire de la plateforme. Accès complet en lecture et écriture sur toutes les entités. Seul rôle capable de créer des utilisateurs, d'assigner des arbitres à des matchs et d'associer des coachs à des équipes.

### Coach

Responsable d'une équipe. Accès en lecture sur l'ensemble des données publiques (championnats, classements, matchs). Accès en écriture limité à la gestion des joueurs de son propre équipe. Un coach est associé à une seule équipe à la fois (association gérée par un Admin).

### Arbitre

Officiel désigné pour un ou plusieurs matchs. Accès en lecture sur l'ensemble des données publiques. Peut saisir et valider le score des matchs qui lui sont explicitement assignés. Ne peut pas modifier d'autres données.

### Joueur _(évolution future)_

Participant inscrit dans une équipe. Accès en lecture seule sur ses propres données (ses matchs, le classement de son équipe, son profil). Ne peut rien modifier. L'activation de ce rôle est conditionnée par une décision de déploiement.

---

## Matrice de permissions

### Gestion des utilisateurs

| Action                     | Admin | Coach | Arbitre | Joueur |
| -------------------------- | ----- | ----- | ------- | ------ |
| Lister les utilisateurs    | ✅    | ❌    | ❌      | ❌     |
| Créer un utilisateur       | ✅    | ❌    | ❌      | ❌     |
| Modifier un utilisateur    | ✅    | ❌    | ❌      | ❌     |
| Supprimer un utilisateur   | ✅    | ❌    | ❌      | ❌     |
| Voir son propre profil     | ✅    | ✅    | ✅      | ✅     |
| Modifier son propre profil | ✅    | ✅    | ✅      | ❌     |

### Championnats

| Action             | Admin | Coach | Arbitre | Joueur |
| ------------------ | ----- | ----- | ------- | ------ |
| Lister / consulter | ✅    | ✅    | ✅      | ✅     |
| Créer              | ✅    | ❌    | ❌      | ❌     |
| Modifier           | ✅    | ❌    | ❌      | ❌     |
| Supprimer          | ✅    | ❌    | ❌      | ❌     |
| Gérer les phases   | ✅    | ❌    | ❌      | ❌     |

### Équipes

| Action                                | Admin | Coach | Arbitre | Joueur |
| ------------------------------------- | ----- | ----- | ------- | ------ |
| Lister / consulter toutes les équipes | ✅    | ✅    | ✅      | ✅     |
| Créer une équipe                      | ✅    | ❌    | ❌      | ❌     |
| Modifier une équipe                   | ✅    | ❌    | ❌      | ❌     |
| Supprimer une équipe                  | ✅    | ❌    | ❌      | ❌     |
| Gérer les joueurs de son équipe       | ✅    | ✅    | ❌      | ❌     |
| Consulter les joueurs de son équipe   | ✅    | ✅    | ❌      | ✅     |

> Un coach ne peut gérer les joueurs que de l'équipe à laquelle il est associé. Il ne peut pas voir la liste des joueurs des équipes adverses.

### Matchs

| Action                              | Admin | Coach | Arbitre | Joueur |
| ----------------------------------- | ----- | ----- | ------- | ------ |
| Lister / consulter                  | ✅    | ✅    | ✅      | ✅     |
| Créer / générer des matchs          | ✅    | ❌    | ❌      | ❌     |
| Modifier les métadonnées d'un match | ✅    | ❌    | ❌      | ❌     |
| Saisir le score d'un match assigné  | ✅    | ❌    | ✅      | ❌     |
| Valider le score d'un match assigné | ✅    | ❌    | ✅      | ❌     |
| Déclarer un forfait                 | ✅    | ❌    | ❌      | ❌     |
| Assigner un arbitre à un match      | ✅    | ❌    | ❌      | ❌     |

> Un arbitre ne peut saisir un score que pour les matchs qui lui sont explicitement assignés (relation `match.refereeId = user.id`).

### Classements

| Action                    | Admin | Coach | Arbitre | Joueur |
| ------------------------- | ----- | ----- | ------- | ------ |
| Consulter les classements | ✅    | ✅    | ✅      | ✅     |

---

## Règles d'assignation

### Coach ↔ Équipe

- Un coach est associé à **une seule équipe** à la fois.
- L'association est créée et modifiée exclusivement par un Admin.
- Un coach sans équipe associée a un accès en lecture seule (comme un arbitre sans match).
- Un Admin peut réassigner un coach à une autre équipe (rompt l'association précédente).

### Arbitre ↔ Match

- Un arbitre peut être assigné à **plusieurs matchs**.
- L'assignation est réalisée exclusivement par un Admin.
- Un match peut n'avoir aucun arbitre assigné (le score est alors saisi par un Admin).
- Un arbitre voit uniquement les matchs qui lui sont assignés dans son espace personnel, mais peut consulter tous les matchs en lecture.

---

## Évolution : rôle Joueur

L'activation du rôle `PLAYER` est conditionnée à la décision de déploiement. Avant activation :

- Le type `PLAYER` existe dans le modèle de données mais ne peut pas être attribué via l'interface.
- Lorsque le rôle est activé, un joueur est associé à une équipe (via la relation existante `Player`).
- Scope d'accès : lecture seule sur ses propres matchs, le classement de son équipe, et son profil.
- Le joueur ne peut pas modifier son profil.

---

## Contraintes de sécurité

- Toutes les routes de l'API vérifient le rôle via un middleware de guard après validation du JWT.
- Les vérifications de propriété (ex. coach → son équipe, arbitre → son match) sont effectuées au niveau de la couche application (use cases), pas uniquement au niveau du middleware.
- Un utilisateur sans rôle valide ou avec un token expiré reçoit une réponse `401 Unauthorized`.
- Un utilisateur avec un rôle insuffisant reçoit une réponse `403 Forbidden`.
