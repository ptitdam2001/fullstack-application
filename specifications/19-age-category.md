# Catégorie d'âge (AgeCategory)

## Définition

Une catégorie d'âge est une entité admin-gérée qui classe les équipes et les championnats par tranche d'âge et genre. Elle remplace l'ancien enum statique (`U9/U11/U13/U15/U18/Senior`) par un modèle dynamique configurable par les administrateurs.

---

## Structure

| Attribut    | Type             | Description                                         |
| ----------- | ---------------- | --------------------------------------------------- |
| `id`        | ObjectId         | Identifiant MongoDB                                 |
| `label`     | string           | Libellé de la catégorie (ex. "U9", "U13", "Senior") |
| `genre`     | Genre            | Genre associé : `MALE`, `FEMALE` ou `MIXED`         |
| `createdAt` | DateTime         | Date de création                                    |
| `updatedAt` | DateTime         | Date de dernière modification                       |
| `deletedAt` | DateTime \| null | Soft delete — null = active                         |

### Genre

| Valeur   | Libellé affiché |
| -------- | --------------- |
| `MALE`   | Masculin        |
| `FEMALE` | Féminin         |
| `MIXED`  | Mixte           |

---

## Contraintes métier

- Le couple `[label, genre]` est **unique** — impossible de créer deux fois "U9 Masculin".
- La suppression est **logique** (soft delete) : une catégorie supprimée n'apparaît plus dans les listes mais reste référencée dans les données historiques.
- Une catégorie liée à une équipe ou un championnat existant **ne peut pas être supprimée** (intégrité référentielle).
- Le `label` ne peut pas être vide.

---

## Règles d'accès

- **Lecture** : tous les utilisateurs authentifiés (nécessaire pour peupler les selects dans les formulaires).
- **Création / Modification / Suppression** : Admin uniquement.

---

## Routes API

| Méthode  | Route                 | Description                         |
| -------- | --------------------- | ----------------------------------- |
| `GET`    | `/age-categories`     | Liste toutes les catégories actives |
| `POST`   | `/age-categories`     | Crée une nouvelle catégorie         |
| `PUT`    | `/age-categories/:id` | Met à jour une catégorie existante  |
| `DELETE` | `/age-categories/:id` | Soft-delete une catégorie           |

---

## Interface admin

Page `/app/admin/age-categories` — accessible aux Admins uniquement.

- Liste des catégories (label + genre + date création).
- Bouton « Nouvelle catégorie » → Sheet avec formulaire (label + genre Select).
- Icône edit par ligne → Sheet pré-remplie.
- Icône delete par ligne → Dialog de confirmation avant soft-delete.
- Erreur 409 si doublon `[label, genre]` → message clair dans le formulaire.

---

## Impact sur les autres domaines

### Équipe (Team)

- `ageCategory` (valeur enum string) remplacé par `ageCategoryId` (FK ObjectId).
- Le champ devient **obligatoire** dans le formulaire de création/édition d'équipe.
- L'API retourne l'objet `ageCategory` complet (label + genre) via relation Prisma `include`.

### Championnat (Championship)

- `ageCategory` (enum) remplacé par `ageCategoryId` (FK ObjectId, requis).
- Même pattern que Team.

---

## Migration des données existantes

Les documents MongoDB existants ont un champ `ageCategory` contenant une valeur d'enum string (`"U9"`, `"Senior"`, etc.). Stratégie :

1. Créer les enregistrements `AgeCategory` de référence en base (seed).
2. Script de migration : lire `ageCategory` string → résoudre l'`id` correspondant → écrire `ageCategoryId`.
3. Supprimer le champ `ageCategory` legacy après validation.

> Les valeurs d'enum legacy (`U9/U11/U13/U15/U18/Senior`) seront créées avec `genre: MALE` par défaut lors du seed initial (à ajuster manuellement si nécessaire).
