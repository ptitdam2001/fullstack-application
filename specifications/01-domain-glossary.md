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

Rencontre entre deux équipes dans le cadre d'une phase. Produit un score final.

### Score (Score)

Résultat d'un match exprimé en nombre de buts marqués par chaque équipe. Peut être absent si le match n'a pas encore été joué.

### Forfait (Forfeit)

Situation où une équipe déclare forfait avant ou pendant un match. La configuration des points du championnat définit le traitement du forfait.

### Classement (Standings)

Tableau ordonné des équipes d'une poule, calculé à partir des résultats de tous les matchs selon la configuration des points du championnat.

### Qualification inter-phases (PhaseQualification)

Règle définissant quelles équipes passent d'une phase à la suivante (ex. : tous les premiers + les X meilleurs deuxièmes).

### Configuration des points (PointsConfig)

Paramètre du championnat définissant combien de points sont attribués selon l'issue d'un match.

---

## Entités utilisateur

### Utilisateur (User)

Compte applicatif. Possède un flag `isAdmin` pour les droits système. Les rôles métier (coach, joueur, arbitre) sont portés par les relations `UserTeam` et `UserMatch`, pas par `User` directement.

### Appartenance équipe (UserTeam)

Relation entre un `User` et une `Team` avec un rôle contextuel (`COACH` ou `PLAYER`). Contrainte d'unicité sur `[userId, teamId, role]` : un même utilisateur peut être COACH et PLAYER de la même équipe simultanément, mais ne peut pas avoir le même rôle deux fois dans la même équipe.

### Rôle d'équipe (TeamRole)

Enum contextuel porté par `UserTeam`. Valeurs : `COACH`, `PLAYER`.

### Profil joueur (Player)

Données spécifiques au rôle joueur dans une équipe : numéro de maillot (`jersey`), poste (`position`). Distinct de `User` (prénom, nom, avatar restent sur `User`). Clé d'unicité : `[userId, teamId]`. Socle pour les futures statistiques par joueur.

### Arbitrage match (UserMatch)

Relation entre un `User` et un `Match` pour désigner un arbitre. Un match peut avoir plusieurs arbitres. Contrainte d'unicité sur `[userId, matchId]`.

---

## Relations clés

```text
AgeCategory
    └── Championship
            └── Phase
                    ├── Group / Bracket
                    │       └── Match ←── UserMatch ──→ User (arbitres)
                    └── PhaseQualification

Team ←── UserTeam ──→ User (coaches, joueurs)
Team ←── Player   ──→ User (profil joueur : maillot, poste)
```
