# Classement

## Définition

Le classement est le tableau ordonné des équipes d'une poule, calculé à partir des résultats de tous les matchs joués dans cette poule. Il est recalculé à chaque nouveau résultat de match.

---

## Structure d'une ligne de classement

| Attribut         | Description                                    |
| ---------------- | ---------------------------------------------- |
| `rank`           | Position dans le classement (1 = premier)      |
| `team`           | Équipe concernée                               |
| `played`         | Nombre de matchs joués (hors annulés)          |
| `won`            | Victoires                                      |
| `drawn`          | Matchs nuls                                    |
| `lost`           | Défaites                                       |
| `forfeited`      | Forfaits déclarés par l'équipe                 |
| `goalsFor`       | Buts marqués                                   |
| `goalsAgainst`   | Buts encaissés                                 |
| `goalDifference` | Différence de buts (`goalsFor - goalsAgainst`) |
| `points`         | Total de points selon la `PointsConfig`        |

---

## Calcul des points

Les points sont attribués match par match selon la `PointsConfig` du championnat :

```text
points = (victories × win) + (draws × draw) + (losses × loss) + (forfeits × forfeit)
```

Exemple avec une config 3/2/1/0 :

- 3 victoires, 1 nul, 1 défaite → `(3×3) + (1×2) + (1×1)` = 12 points

---

## Règles de départage (ordre de priorité)

En cas d'égalité de points entre deux équipes ou plus :

| Priorité | Critère                                                          |
| -------- | ---------------------------------------------------------------- |
| 1        | Points totaux                                                    |
| 2        | Confrontations directes : points entre les équipes à égalité     |
| 3        | Confrontations directes : différence de buts                     |
| 4        | Confrontations directes : buts marqués                           |
| 5        | Différence de buts générale                                      |
| 6        | Buts marqués (général)                                           |
| 7        | Décision manuelle (tirage au sort ou décision de l'organisateur) |

> Les confrontations directes (priorités 2, 3, 4) ne s'appliquent qu'entre les équipes strictement à égalité de points, pas l'ensemble de la poule.

---

## Classement inter-poules (pour la qualification)

Lorsque la qualification inter-phases requiert de comparer des équipes issues de poules différentes (ex. "les 2 meilleurs 2èmes"), un classement comparatif est établi.

### Principe d'équité

Pour que la comparaison soit juste, seuls les résultats contre les équipes **communes** sont pris en compte. Si les poules ont des tailles différentes, les matchs contre la ou les dernières équipes au classement de chaque poule sont exclus jusqu'à ce que toutes les poules aient le même nombre de matchs comparés.

### Critères de ce classement comparatif

| Priorité | Critère                                               |
| -------- | ----------------------------------------------------- |
| 1        | Points (sur matchs retenus)                           |
| 2        | Différence de buts (sur matchs retenus)               |
| 3        | Buts marqués (sur matchs retenus)                     |
| 4        | Différence de buts générale (tous matchs de la poule) |
| 5        | Buts marqués général                                  |
| 6        | Décision manuelle                                     |

---

## Classement et phases éliminatoires

Dans une phase `KNOCKOUT`, il n'y a pas de classement de poule. L'avancement est déterminé par le vainqueur de chaque match.

Un classement final peut être reconstitué a posteriori (1er, 2ème, 3ème/4ème) à partir des résultats du tableau éliminatoire, y compris un éventuel match pour la 3ème place.

---

## Contraintes métier

- Le classement d'une poule n'est final que lorsque tous les matchs de la poule sont dans l'état `PLAYED`, `FORFEITED` ou `CANCELLED`.
- Un match `CANCELLED` n'est pas comptabilisé dans les statistiques.
- Un match `FORFEITED` est comptabilisé avec les points définis dans `PointsConfig` (équipe en forfait) et le score conventionnel éventuel.
- La qualification inter-phases ne peut être déclenchée que lorsque le classement de toutes les poules de la phase est final.
