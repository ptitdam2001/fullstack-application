# Glossaire du domaine

## Entités principales

### Catégorie d'âge (AgeCategory)

Tranche d'âge réglementaire définissant le niveau de compétition.
Valeurs possibles : `U9`, `U11`, `U13`, `U15`, `U18`, `Senior`.

### Championnat (Championship)

Compétition organisée pour une catégorie d'âge donnée lors d'une saison.
Un championnat est composé d'une ou plusieurs **phases** qui se déroulent séquentiellement.

### Phase (Phase)

Étape d'un championnat. Une phase possède un type et un ensemble de groupes (poules ou tableaux).
Types : `GROUP` (poule), `KNOCKOUT` (éliminatoires).

### Poule (Group)

Ensemble d'équipes jouant les unes contre les autres dans le cadre d'une phase de type `GROUP`.
Une poule génère un classement en fin de phase.

### Tableau éliminatoire (Bracket)

Ensemble de rencontres à élimination directe (1/4, 1/2, finale) dans le cadre d'une phase de type `KNOCKOUT`.

### Équipe (Team)

Participant au championnat, représenté par une couleur et associé à un lieu de match (terrain).

### Match (Match)

Rencontre entre deux équipes (un hôte et un visiteur) dans le cadre d'une phase. Produit un score final.

### Score (Score)

Résultat d'un match exprimé en nombre de buts marqués par chaque équipe (`homeGoals`, `awayGoals`). Peut être absent si le match n'a pas encore été joué.

### Forfait (Forfeit)

Situation où une équipe déclare forfait avant ou pendant un match. La configuration des points du championnat définit le traitement du forfait.

### Classement (Standings)

Tableau ordonné des équipes d'une poule, calculé à partir des résultats de tous les matchs de la poule selon la configuration des points du championnat.

### Qualification inter-phases (PhaseQualification)

Règle définissant quelles équipes passent d'une phase à la suivante (ex. : tous les premiers + les X meilleurs deuxièmes).

### Configuration des points (PointsConfig)

Paramètre du championnat définissant combien de points sont attribués selon l'issue d'un match.

---

## Relations clés

```text
AgeCategory
    └── Championship (1 catégorie → N championnats, ex. saisons différentes)
            └── Phase (ordonné, ex. Phase 1 = poules, Phase 2 = élimination)
                    ├── Group / Bracket
                    │       └── Match (hôte, visiteur, score)
                    └── PhaseQualification (règle de passage vers la phase suivante)
```
