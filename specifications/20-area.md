# Lieu (Area)

## Définition

Un lieu (Area) est un espace physique — terrain de sport, salle, complexe — identifié par une adresse et des coordonnées GPS. Les lieux sont utilisés pour localiser les matchs et les entraînements des équipes.

---

## Structure

| Attribut    | Type             | Description                             |
| ----------- | ---------------- | --------------------------------------- |
| `id`        | ObjectId         | Identifiant MongoDB                     |
| `name`      | string \| null   | Nom du lieu (ex. "Stade Pierre-Dupont") |
| `address`   | string           | Adresse postale (min 1 car.)            |
| `city`      | string           | Ville (min 1 car.)                      |
| `longitude` | float            | Longitude GPS                           |
| `latitude`  | float            | Latitude GPS                            |
| `updatedAt` | DateTime         | Date de dernière modification (auto)    |
| `deletedAt` | DateTime \| null | Soft delete — null = actif              |

> `name` est optionnel : un lieu peut être identifié uniquement par son adresse et sa ville.

---

## Contraintes métier

- `address` et `city` sont **obligatoires** (min 1 caractère).
- `longitude` et `latitude` sont **obligatoires** (valeurs float).
- La suppression est **logique** (soft delete) : un lieu supprimé n'apparaît plus dans les listes admin, mais les données historiques (matchs) restent intactes.
- Un lieu supprimé ne peut plus être lié à une équipe ni assigné à un nouveau match.
- Les coordonnées GPS (`longitude`, `latitude`) ne font pas l'objet d'une validation de plage côté backend pour l'instant ; la saisie est laissée à la responsabilité de l'admin.

---

## Règles d'accès

| Action            | Admin | Coach | Joueur | Public |
| ----------------- | :---: | :---: | :----: | :----: |
| Lister les lieux  |  ✅   | ✅\*  |   ❌   |   ❌   |
| Voir un lieu      |  ✅   | ✅\*  |   ❌   |   ❌   |
| Créer un lieu     |  ✅   |  ❌   |   ❌   |   ❌   |
| Modifier un lieu  |  ✅   |  ✅   |   ❌   |   ❌   |
| Supprimer un lieu |  ✅   |  ❌   |   ❌   |   ❌   |

> \* Le rôle Coach pourra lire la liste des lieux pour sélectionner un lieu à lier à son équipe — cette fonctionnalité est **différée** (hors scope de la première itération).

---

## Routes API

| Méthode  | Route          | Auth         | Description                      |
| -------- | -------------- | ------------ | -------------------------------- |
| `GET`    | `/areas`       | Connecté     | Liste les lieux actifs (paginée) |
| `GET`    | `/areas/count` | Connecté     | Nombre total de lieux actifs     |
| `GET`    | `/areas/:id`   | Connecté     | Détail d'un lieu                 |
| `POST`   | `/areas`       | Admin        | Crée un lieu                     |
| `PATCH`  | `/areas/:id`   | Admin, Coach | Met à jour un lieu               |
| `DELETE` | `/areas/:id`   | Admin        | Soft-delete un lieu              |

### Paramètres de pagination (`GET /areas`)

| Paramètre | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| `page`    | number | Index 0-based (offset = page × limit) |
| `limit`   | number | Nombre d'éléments à retourner         |

---

## Interface admin

Page `/app/settings/areas` — accessible aux Admins.

- Liste des lieux actifs (nom, adresse, ville).
- Bouton « Nouveau lieu » → Dialog modal avec formulaire (name, address, city, longitude, latitude).
- Icône edit par ligne → Dialog modal pré-remplie.
- Icône delete par ligne → Dialog de confirmation avant soft-delete.

---

## Intégrations avec les autres domaines

### Match

Un match peut avoir un lieu assigné. Le lieu est **dénormalisé** (snapshot `EmbeddedArea`) au moment de l'assignation :

```prisma
type EmbeddedArea {
  id        String
  name      String?
  address   String
  city      String
  longitude Float
  latitude  Float
}
```

La soft-delete d'un lieu **n'altère pas** les snapshots existants dans les matchs. Le lieu supprimé reste visible dans l'historique des matchs passés.

### Équipe (Team)

Une équipe peut avoir plusieurs lieux (`areas: Area[]`). Ces lieux correspondent aux terrains d'entraînement et domicile. La liaison équipe-lieu est gérée via le formulaire d'équipe (scope futur pour le rôle Coach).

---

## Prisma schema

```prisma
model Area {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  name      String?
  address   String
  city      String
  longitude Float
  latitude  Float
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@map("areas")
}
```

> `deletedAt` n'est **pas exposé** dans les réponses API — il est filtré côté backend via le helper `notDeleted`.

---

## Architecture hexagonale (backend)

```text
backend/src/area/
├── domain/
│   ├── Area.ts              # types purs (sans Prisma, sans Express)
│   └── AreaErrors.ts        # AreaNotFoundError
├── ports/
│   └── IAreaRepository.ts   # interface de sortie (repository)
├── application/
│   ├── AreaUseCases.ts      # logique métier
│   └── AreaUseCases.test.ts # tests unitaires
└── infrastructure/
    ├── PrismaAreaRepository.ts  # implémentation Prisma
    └── AreaHttpHandlers.ts      # adaptateur HTTP (Express + openapi-backend)
```
