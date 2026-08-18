# Match

## Définition

Un match est une rencontre entre deux équipes dans le cadre d'une phase de championnat. Il produit un **score final** qui alimente le classement de la poule ou le tableau éliminatoire.

---

## Structure d'un match

| Attribut      | Type             | Description                                                     |
| ------------- | ---------------- | --------------------------------------------------------------- |
| `homeTeam`    | Team             | Équipe qui reçoit (joue sur son terrain)                        |
| `awayTeam`    | Team             | Équipe visiteuse                                                |
| `phase`       | Phase            | Phase du championnat à laquelle appartient le match             |
| `group`       | Group \| Bracket | Poule ou tableau éliminatoire du match                          |
| `scheduledAt` | Date \| null     | Date et heure prévues du match (optionnel)                      |
| `area`        | Area \| null     | Terrain du match (optionnel — peut être assigné après création) |
| `homeGoals`   | number \| null   | Buts de l'équipe hôte (null = match non joué)                   |
| `awayGoals`   | number \| null   | Buts de l'équipe visiteuse (null = match non joué)              |
| `status`      | MatchStatus      | État du match                                                   |
| `forfeitedBy` | Team \| null     | Équipe ayant déclaré forfait (null si aucun forfait)            |

---

## États d'un match (MatchStatus)

| État        | Description                                  |
| ----------- | -------------------------------------------- |
| `SCHEDULED` | Match planifié, pas encore joué              |
| `PLAYED`    | Match joué, score final enregistré           |
| `FORFEITED` | Match annulé suite à un forfait d'une équipe |
| `CANCELLED` | Match annulé (raison autre que forfait)      |

---

## Résultat d'un match

### Match joué (status = PLAYED)

Le score (`homeGoals`, `awayGoals`) détermine l'issue :

| Issue             | Condition                 | Points hôte | Points visiteur |
| ----------------- | ------------------------- | ----------- | --------------- |
| Victoire hôte     | `homeGoals > awayGoals`   | `win`       | `loss`          |
| Victoire visiteur | `awayGoals > homeGoals`   | `loss`      | `win`           |
| Match nul         | `homeGoals === awayGoals` | `draw`      | `draw`          |

Les valeurs `win`, `draw`, `loss` sont définies par la `PointsConfig` du championnat.

### Forfait (status = FORFEITED)

- L'équipe ayant déclaré forfait reçoit `forfeit` points (défini dans `PointsConfig`).
- L'équipe adverse reçoit `win` points **ou** un score conventionnel (ex. 3-0) selon la configuration du championnat.
- Un match ne peut être déclaré forfait que par **une seule** équipe.

### Match annulé (status = CANCELLED)

- Aucun point n'est attribué.
- Le match est ignoré dans le calcul du classement.

---

## Génération automatique des matchs

### Mode aller simple (SINGLE)

Pour N équipes dans une poule : `N × (N-1) / 2` matchs générés.

Chaque paire d'équipes se rencontre exactement une fois. L'assignation hôte/visiteur est déterminée lors de la génération (aléatoire ou selon un algorithme de rotation).

### Mode aller-retour (HOME_AND_AWAY)

Pour N équipes dans une poule : `N × (N-1)` matchs générés.

Chaque paire d'équipes se rencontre deux fois — une fois à domicile pour chaque équipe.

### Matchs éliminatoires (KNOCKOUT)

Les matchs sont générés au fur et à mesure de l'avancement du tableau. Chaque vainqueur d'un match génère le match suivant dans le tableau.

---

## Liste des matchs (Admin)

La liste admin (`GET /matches`) affiche une grille de cartes avec les filtres suivants :

| Filtre      | Paramètre        | Description                                                                                 |
| ----------- | ---------------- | ------------------------------------------------------------------------------------------- |
| Championnat | `championshipId` | Filtre par id de championnat uniquement — pas de filtre par `groupId`/`phaseId` directement |
| Catégorie   | `ageCategoryId`  | Filtre par id de catégorie d'âge (résout tous les championnats de cette catégorie)          |
| Statut      | `status`         | `SCHEDULED` / `PLAYED` / `FORFEITED` / `CANCELLED` (existant)                               |

`Match` n'a pas de FK directe vers `Championship` — la résolution du filtre remonte la chaîne `Match.groupId/bracketId → Group/Bracket.phaseId → Phase.championshipId → Championship.ageCategoryId`, côté backend, avant de filtrer les matchs par `groupId`/`bracketId` résolus.

Chaque carte affiche :

| Champ           | Source                            | Description                                                                                                                                         |
| --------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Championnat     | `championshipName` (résolu)       | Calculé à la volée depuis `groupId`/`bracketId → phase → championship`, non stocké (même approche que les champs calculés de la liste championnats) |
| Poule / tableau | `stageName` (résolu)              | `Group.name` ou `Bracket.name` selon le type de phase du match                                                                                      |
| Équipes         | `homeTeam` / `awayTeam` (résolus) | `{id, name, color}` — pastille de couleur + nom, gras pour l'équipe gagnante                                                                        |
| Score           | `homeGoals` / `awayGoals`         | Tiret si le match n'est pas encore `PLAYED`/`FORFEITED`                                                                                             |
| Date            | `scheduledAt`                     | Formatée jour/mois + heure ; tiret si absente                                                                                                       |
| Statut          | `status`                          | Badge coloré (À venir / Joué / Forfait)                                                                                                             |

`championshipName`, `stageName`, `homeTeam` et `awayTeam` sont des champs additifs exposés par `GET /matches` et `GET /match/{id}` — `homeTeamId`/`awayTeamId` restent inchangés en parallèle.

**Actions par carte** :

- **Saisir le score** (visible si `SCHEDULED`) / **Modifier le score** (si `PLAYED`/`FORFEITED`) — ouvre une saisie des deux scores, envoie `status: PLAYED` + `homeGoals`/`awayGoals` via le `PATCH /match/{id}` existant (lecture-modification-écriture : la ligne déjà affichée porte toutes les données requises par `MatchInput`, pas de fetch supplémentaire).
- **Supprimer** — masqué/désactivé côté client si le match est `PLAYED`/`FORFEITED` (l'API autorise déjà la suppression à tout statut : hard-delete si `SCHEDULED`/`CANCELLED`, soft-delete sinon — cette restriction est une affordance d'interface, pas une règle serveur nouvelle).

**Accès** : `GET /matches`, `GET /matches/count` et `GET /match/{id}` sont réservés aux administrateurs (`requireAdmin`), alignés sur les routes d'écriture déjà admin-only.

**Point d'entrée** : l'item de menu latéral admin historiquement intitulé « Matchs sans score » (badge = nombre de matchs `SCHEDULED` dont la date est dépassée) est renommé « Matchs » et pointe vers cette liste ; le badge conserve la même définition (compteur inchangé).

**Hors scope de cette itération** : vue Timeline (regroupement hebdomadaire par jour) et son bouton de bascule Grille/Timeline ; édition des autres champs du match (terrain, date, équipes) — aucun formulaire d'édition dédié n'existe encore, seul l'item de menu correspondant est différé jusqu'à son implémentation.

---

## Contraintes métier

- Un match ne peut pas opposer une équipe à elle-même.
- Le score ne peut être saisi que si le match est `SCHEDULED` (transition vers `PLAYED`).
- Un match `PLAYED` peut être corrigé (score modifiable par un administrateur).
- Un match `FORFEITED` ou `CANCELLED` ne peut plus être joué.
- Un match `PLAYED` ne peut plus être déclaré forfait.
- `homeGoals` et `awayGoals` sont tous les deux renseignés ou tous les deux absents.
- Pour les matchs éliminatoires, un match nul n'est pas autorisé en fin de match (séance de tirs au but ou prolongation — le résultat final doit désigner un vainqueur).
