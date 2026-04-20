# Match

## Définition

Un match est une rencontre entre deux équipes dans le cadre d'une phase de championnat. Il produit un **score final** qui alimente le classement de la poule ou le tableau éliminatoire.

---

## Structure d'un match

| Attribut      | Type             | Description                                          |
| ------------- | ---------------- | ---------------------------------------------------- |
| `homeTeam`    | Team             | Équipe qui reçoit (joue sur son terrain)             |
| `awayTeam`    | Team             | Équipe visiteuse                                     |
| `phase`       | Phase            | Phase du championnat à laquelle appartient le match  |
| `group`       | Group \| Bracket | Poule ou tableau éliminatoire du match               |
| `scheduledAt` | Date \| null     | Date et heure prévues du match (optionnel)           |
| `homeGoals`   | number \| null   | Buts de l'équipe hôte (null = match non joué)        |
| `awayGoals`   | number \| null   | Buts de l'équipe visiteuse (null = match non joué)   |
| `status`      | MatchStatus      | État du match                                        |
| `forfeitedBy` | Team \| null     | Équipe ayant déclaré forfait (null si aucun forfait) |

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

## Contraintes métier

- Un match ne peut pas opposer une équipe à elle-même.
- Le score ne peut être saisi que si le match est `SCHEDULED` (transition vers `PLAYED`).
- Un match `PLAYED` peut être corrigé (score modifiable par un administrateur).
- Un match `FORFEITED` ou `CANCELLED` ne peut plus être joué.
- Un match `PLAYED` ne peut plus être déclaré forfait.
- `homeGoals` et `awayGoals` sont tous les deux renseignés ou tous les deux absents.
- Pour les matchs éliminatoires, un match nul n'est pas autorisé en fin de match (séance de tirs au but ou prolongation — le résultat final doit désigner un vainqueur).
