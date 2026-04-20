# Championnat

## Définition

Un championnat est une compétition rattachée à une **catégorie d'âge** et à une **saison**. Il est composé d'une suite ordonnée de **phases** qui se déroulent séquentiellement.

---

## Catégories d'âge

| Code   | Description     |
| ------ | --------------- |
| U9     | Moins de 9 ans  |
| U11    | Moins de 11 ans |
| U13    | Moins de 13 ans |
| U15    | Moins de 15 ans |
| U18    | Moins de 18 ans |
| Senior | Seniors         |

---

## Configuration des points (PointsConfig)

Chaque championnat définit sa propre table de points appliquée lors du calcul des classements.

| Situation | Exemple de valeur | Description                                       |
| --------- | ----------------- | ------------------------------------------------- |
| Victoire  | 3                 | Points attribués à l'équipe gagnante              |
| Match nul | 2                 | Points attribués à chaque équipe en cas d'égalité |
| Défaite   | 1                 | Points attribués à l'équipe perdante              |
| Forfait   | 0                 | Points attribués à l'équipe déclarant forfait     |

> La configuration est libre : l'organisateur peut choisir n'importe quelle valeur pour chaque situation.
> La règle classique (3/1/0) reste possible, tout comme des systèmes alternatifs (3/2/1/0, etc.).

---

## Phases d'un championnat

### Phase unique (cas simple)

Un championnat peut ne contenir qu'une seule phase de type `GROUP` avec une poule unique en **aller-retour**.

```text
Championnat
└── Phase 1 — GROUP
        └── Poule unique (aller-retour)
```

### Championnat multi-phases (cas avancé)

Un championnat peut enchaîner plusieurs phases, chacune conditionnée par les résultats de la précédente.

```text
Championnat
├── Phase 1 — GROUP       (poules, matchs à aller simple ou aller-retour)
│       └── PhaseQualification → définit qui passe en Phase 2
├── Phase 2 — KNOCKOUT    (éliminatoires : 1/4, 1/2, finale)
│       └── PhaseQualification → définit qui passe en Phase 3 (si applicable)
└── Phase 3 — GROUP/KNOCKOUT (optionnel)
```

---

## Types de phases

### GROUP (poule)

- Les équipes sont réparties dans une ou plusieurs poules.
- Chaque équipe rencontre toutes les autres équipes de sa poule.
- Mode de rencontre : `SINGLE` (aller simple) ou `HOME_AND_AWAY` (aller-retour).
- Un classement est généré par poule en fin de phase.

### KNOCKOUT (éliminatoires)

- Les équipes sont appariées deux à deux.
- L'équipe perdante est éliminée.
- Formats possibles : 1/4 de finale, 1/2 de finale, finale, ou séquence personnalisée.
- Des matchs de classement (3ème, 4eme, 5eme place, etc.) peuvent être ajoutés optionnellement.

---

## Règles de qualification inter-phases (PhaseQualification)

Définit comment les équipes issues d'une phase `GROUP` sont sélectionnées pour la phase suivante.

### Critères de sélection

1. **Par rang dans la poule** : ex. tous les 1ers de chaque poule qualifiés automatiquement.
2. **Meilleurs classés parmi un rang** : ex. les 2 meilleurs 2èmes (classement comparatif entre poules).
3. **Combinaison** : ex. tous les 1ers + les 2 meilleurs 2èmes.

### Règles de départage inter-poules (pour les meilleurs N du même rang)

Quand plusieurs équipes du même rang (ex. 2èmes de poule différentes) sont comparées entre elles :

1. Points totaux (selon `PointsConfig`)
2. Différence de buts
3. Nombre de buts marqués
4. En cas d'égalité parfaite : tirage au sort (décision manuelle)

> Le départage inter-poules n'utilise que les matchs joués contre les équipes qui ont participé au même nombre de matchs dans leur poule respective, afin d'assurer une comparaison équitable.

---

## Contraintes métier

- Un championnat doit avoir au moins une phase.
- Une phase doit avoir au moins une poule ou un tableau éliminatoire.
- Une poule doit avoir au moins 2 équipes.
- Les matchs d'une phase ne peuvent pas débuter avant que la phase précédente soit terminée (tous les matchs joués).
- La qualification inter-phases ne peut être calculée qu'une fois la phase source complète.
