# Équipe

## Définition

Une équipe est un participant inscrit à un championnat. Elle est identifiée par une **couleur** et associée à un **lieu de match** (terrain). Une équipe appartient à une catégorie d'âge et peut participer à plusieurs championnats (saisons différentes ou championnats de même catégorie).

---

## Structure d'une équipe

| Attribut         | Type          | Description                                         |
| ---------------- | ------------- | --------------------------------------------------- |
| `name`           | string        | Nom de l'équipe (ex. "Rouge", "Bleu Ciel")          |
| `color`          | Color         | Couleur principale représentant l'équipe            |
| `secondaryColor` | Color \| null | Couleur secondaire (optionnelle, pour les maillots) |
| `venue`          | Venue         | Lieu de match associé (terrain domicile)            |
| `ageCategory`    | AgeCategory   | Catégorie d'âge de l'équipe                         |

---

## Couleur (Color)

La couleur est l'identifiant visuel principal d'une équipe dans le contexte du championnat.

- Représentée par une valeur CSS (`red`, `#1A73E8`, `rgb(...)`) ou un nom normalisé.
- Deux équipes dans la même poule ne devraient pas avoir des couleurs identiques (avertissement, pas blocage).

---

## Lieu de match (Venue)

Le terrain domicile d'une équipe, utilisé pour les matchs où elle est hôte.

| Attribut  | Type           | Description                            |
| --------- | -------------- | -------------------------------------- |
| `name`    | string         | Nom du terrain (ex. "Stade Municipal") |
| `address` | string \| null | Adresse complète (optionnelle)         |
| `city`    | string         | Ville                                  |

---

## Participation à un championnat

Une équipe est **inscrite** à un championnat. L'inscription est matérialisée par une entité `ChampionshipTeam` qui relie l'équipe au championnat et à sa ou ses poules.

- Une équipe peut être dans une seule poule par phase `GROUP`.
- Une équipe peut participer à des phases `KNOCKOUT` issues de sa qualification.
- Une équipe peut être retirée d'un championnat en cours (ses matchs passés restent dans l'historique, les matchs futurs sont annulés).

---

## Contraintes métier

- Le nom d'une équipe est unique au sein d'un championnat.
- La couleur est obligatoire.
- Un terrain (Venue) peut être partagé entre plusieurs équipes.
- Une équipe doit être dans la même catégorie d'âge que le championnat auquel elle est inscrite.
