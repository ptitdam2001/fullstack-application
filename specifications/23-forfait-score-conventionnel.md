# Score conventionnel de forfait

## Définition

Chaque championnat définit, lors de sa configuration, un **score conventionnel de forfait** unique (ex. 3-0) au sein de sa `PointsConfig`. Ce score est appliqué automatiquement à tout match dont le statut passe à `FORFEITED`, quel que soit l'acteur qui déclare le forfait. Il remplace immédiatement toute saisie de score existante sur le match et alimente le calcul de la différence de buts au classement — un critère de départage important en phase de poule (voir [[05-standings]]).

---

## Acteurs concernés

| Rôle    | Implication                                                                                                                                                                             |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin   | Configure le score conventionnel à la création du championnat (bloc `PointsConfig`, étape 4 du wizard) — seul rôle habilité à créer/modifier un championnat (voir [[06-user-profiles]]) |
| Coach   | Déclare un forfait pré-match pour son équipe, après confirmation explicite — le score conventionnel s'applique dès validation ([[06-user-profiles]] L117, L123)                         |
| Arbitre | Déclare un forfait en direct pour un match qui lui est assigné, après confirmation explicite — le score conventionnel s'applique avec effet immédiat ([[06-user-profiles]] L118, L124)  |

> Le Joueur et l'utilisateur sans équipe ne sont pas concernés — accès lecture seule sur le résultat, sans implication dans le déclenchement ou la configuration.

---

## Règles métier

### Score conventionnel obligatoire à la configuration

Le score conventionnel de forfait est un champ **obligatoire** de `PointsConfig`, au même titre que les valeurs Victoire/Match nul/Défaite/Forfait déjà existantes (voir [[02-championship]] section « Configuration des points »). Un championnat ne peut être créé sans cette valeur — cohérent avec l'importance de la différence de buts en classement de poule.

Le score conventionnel est exprimé comme le nombre de buts attribués à l'équipe adverse de celle en forfait (ex. `3` pour un score conventionnel de 3-0). L'équipe en forfait reçoit toujours `0` but.

### Unique par championnat

Le score conventionnel est défini **une seule fois par championnat**, au niveau de sa `PointsConfig`. Il ne varie pas par phase, par poule, ni par catégorie d'âge au sein d'un même championnat.

### Confirmation obligatoire avant déclaration (action irréversible)

Déclarer un forfait est une action **irréversible** : une fois le match passé au statut `FORFEITED`, il ne peut plus être rejoué ni repasser à `SCHEDULED`/`PLAYED` ([[03-match]]). En conséquence, quel que soit l'acteur (Coach ou Arbitre), l'interface doit présenter une **popup de confirmation explicite** avant toute déclaration de forfait, rappelant :

- le caractère définitif de l'action,
- l'équipe qui sera déclarée forfait,
- le score conventionnel qui sera appliqué en conséquence.

La déclaration n'est effective qu'après validation explicite de cette confirmation. Un clic accidentel sur l'action de déclaration ne doit jamais déclencher le forfait sans passer par cette étape.

### Application automatique et écrasement de la saisie manuelle

Dès qu'un match passe au statut `FORFEITED` (après confirmation) :

- `homeGoals`/`awayGoals` sont fixés automatiquement selon le score conventionnel du championnat et le camp en forfait.
- Si un score partiel avait déjà été saisi sur ce match avant la déclaration de forfait (ex. l'arbitre commence à noter 1-0 avant de constater le forfait), ce score est **écrasé** — le score conventionnel prévaut systématiquement. Aucune conservation de la saisie manuelle antérieure.

### Un seul forfait par match

Un match ne peut avoir qu'**une seule** équipe en forfait — règle déjà en vigueur ([[03-match]] « Un match ne peut être déclaré forfait que par une seule équipe »). Dès qu'une équipe est déclarée forfait sur un match, toute tentative de déclarer également l'équipe adverse en forfait sur ce même match est refusée. **La première déclaration fait foi** : le forfait mutuel n'est pas possible, quel que soit l'acteur (Coach ou Arbitre) à l'origine de chaque tentative.

### Impact sur le classement

Le score conventionnel alimente `goalsFor`/`goalsAgainst` du match forfait, donc `goalDifference` dans le calcul du classement ([[05-standings]]). En phase de poule, ce critère intervient dans le départage lorsque plusieurs équipes sont à égalité de points — la différence de buts issue d'un forfait a donc un impact réel sur le classement final.

### Verrouillage cohérent avec la configuration existante

Le score conventionnel suit la même règle de verrouillage que le reste de `PointsConfig` ([[02-championship]] « Modification et suppression ») : modifiable tant qu'aucun score n'a été saisi sur un match de la phase courante ; verrouillé dès qu'un score (y compris un score conventionnel appliqué suite à un forfait) est enregistré.

---

## Matrice de permissions

| Action                                              | Admin | Coach (son équipe) | Arbitre (son match) | Joueur | Sans équipe |
| --------------------------------------------------- | ----- | ------------------ | ------------------- | ------ | ----------- |
| Configurer le score conventionnel (création champ.) | ✅    | ❌                 | ❌                  | ❌     | ❌          |
| Déclarer un forfait pré-match (avec confirmation)   | ✅    | ✅                 | ❌                  | ❌     | ❌          |
| Déclarer un forfait en direct (avec confirmation)   | ✅    | ❌                 | ✅                  | ❌     | ❌          |
| Consulter le score résultant d'un forfait           | ✅    | ✅                 | ✅                  | ✅     | ✅          |

---

## Cas limites et contraintes

- Un match `PLAYED` ne peut plus être déclaré forfait — règle existante inchangée ([[03-match]]).
- Un match déjà `FORFEITED` ou `CANCELLED` ne peut plus être joué ni redéclaré forfait.
- Le score conventionnel s'applique aussi bien en phase `GROUP` qu'en phase `KNOCKOUT` (bracket) — dans ce dernier cas, il alimente `advanceWinner` au même titre qu'un score saisi manuellement, mais n'a pas d'impact sur un classement (pas de calcul de classement en knockout).
- Si l'admin tente de créer un championnat sans renseigner le score conventionnel, la création est bloquée — champ requis au même niveau que les autres valeurs de `PointsConfig`.
- La popup de confirmation doit être annulable sans conséquence (fermeture = aucune action, le match reste dans son statut précédent).

---

## Questions ouvertes

- **Forfait général d'une équipe** : possibilité évoquée de déclarer une équipe forfait pour l'ensemble de son championnat en une seule action, ce qui appliquerait automatiquement le score conventionnel de forfait à tous ses matchs futurs (`SCHEDULED`) du championnat. Non spécifié à ce stade — périmètre, acteur habilité (Admin seul ? Coach ?), et interaction avec les matchs déjà `PLAYED` restent à définir.
