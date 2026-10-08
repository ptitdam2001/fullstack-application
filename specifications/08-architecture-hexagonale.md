# Architecture hexagonale

## Principes fondamentaux

L'architecture hexagonale (Ports & Adapters) organise le code en couches concentriques avec une règle de dépendance stricte : **les dépendances ne peuvent aller que vers l'intérieur**.

```text
Infrastructure → Application → Domain
     (adapters)   (use cases)  (pure logic)
```

- **Domain** : entités pures, erreurs, value objects. N'importe aucun framework (pas de Prisma, pas d'Express, pas de React).
- **Ports** : interfaces TypeScript définissant les contrats (output ports = repositories, service ports = services externes).
- **Application** : use cases injectés via les interfaces des ports. N'importe jamais d'implémentations concrètes.
- **Infrastructure** : implémentations concrètes (Prisma, Express handlers, hooks orval). Dépend des ports.

---

## Backend

### Structure par domaine

```text
backend/src/<domain>/
├── domain/
│   ├── <Entity>.ts              # Types purs, value objects (sans Prisma)
│   └── <Entity>Errors.ts        # Erreurs domaine typées
├── ports/
│   └── I<Entity>Repository.ts   # Interface output port
├── application/
│   ├── <Entity>UseCases.ts      # Use cases injectés via interface
│   └── <Entity>UseCases.test.ts # Tests unitaires (mocks d'interfaces)
└── infrastructure/
    ├── Prisma<Entity>Repository.ts  # Implémente le port via Prisma
    └── <Entity>HttpHandlers.ts      # Adaptateur HTTP Express
```

### Domaines et ports

Un domaine correspond à un dossier `backend/src/<domain>/`. Ses ports sont les interfaces de son dossier `ports/`.

| Domaine           | Description                                                        | Port(s)                                                                                                                                                                                    |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ageCategory`     | Catégories d'âge gérées par l'admin                                | [`IAgeCategoryRepository`](../backend/src/ageCategory/ports/IAgeCategoryRepository.ts)                                                                                                     |
| `area`            | Lieux de match                                                     | [`IAreaRepository`](../backend/src/area/ports/IAreaRepository.ts)                                                                                                                          |
| `auth`            | Login, JWT, me                                                     | [`IAuthService`](../backend/src/auth/ports/IAuthService.ts) _(port de service)_                                                                                                            |
| `bracket`         | Tableaux à élimination d'une phase                                 | [`IBracketRepository`](../backend/src/bracket/ports/IBracketRepository.ts)                                                                                                                 |
| `championship`    | CRUD championnats                                                  | [`IChampionshipRepository`](../backend/src/championship/ports/IChampionshipRepository.ts)                                                                                                  |
| `group`           | Groupes (poules) d'une phase                                       | [`IGroupRepository`](../backend/src/group/ports/IGroupRepository.ts)                                                                                                                       |
| `health`          | État de santé de l'API                                             | — _(aucune dépendance externe)_                                                                                                                                                            |
| `image`           | Stockage des images (photo de profil), voir [[24-page-compte]]     | [`IImageStorage`](../backend/src/image/ports/IImageStorage.ts) _(port de service)_                                                                                                         |
| `match`           | CRUD matchs + scores                                               | [`IMatchRepository`](../backend/src/match/ports/IMatchRepository.ts)                                                                                                                       |
| `phase`           | Phases d'un championnat                                            | [`IPhaseRepository`](../backend/src/phase/ports/IPhaseRepository.ts)                                                                                                                       |
| `player`          | Profils joueurs (maillot, poste)                                   | [`IPlayerRepository`](../backend/src/player/ports/IPlayerRepository.ts)                                                                                                                    |
| `registration`    | Inscription, activation du compte, réinitialisation du mot de passe | [`IRegistrationRepository`](../backend/src/registration/ports/IRegistrationRepository.ts), [`IEmailService`](../backend/src/registration/ports/IEmailService.ts) _(port de service)_       |
| `season`          | Saisons                                                            | [`ISeasonRepository`](../backend/src/season/ports/ISeasonRepository.ts)                                                                                                                    |
| `standings`       | Classement d'un groupe                                             | [`IStandingsRepository`](../backend/src/standings/ports/IStandingsRepository.ts)                                                                                                           |
| `team`            | CRUD équipes + joueurs + calendrier                                | [`ITeamRepository`](../backend/src/team/ports/ITeamRepository.ts)                                                                                                                          |
| `teamJoinRequest` | Demandes pour rejoindre une équipe                                 | [`ITeamJoinRequestRepository`](../backend/src/teamJoinRequest/ports/ITeamJoinRequestRepository.ts)                                                                                         |
| `user`            | Gestion des utilisateurs, état d'authentification du compte        | [`IUserRepository`](../backend/src/user/ports/IUserRepository.ts)                                                                                                                          |
| `userMatch`       | Assignation arbitres User ↔ Match                                  | [`IUserMatchRepository`](../backend/src/userMatch/ports/IUserMatchRepository.ts)                                                                                                           |
| `userTeam`        | Appartenance User ↔ Team avec rôle (COACH ou PLAYER)               | [`IUserTeamRepository`](../backend/src/userTeam/ports/IUserTeamRepository.ts)                                                                                                              |

### Contrats des ports

**Le fichier `ports/` de chaque domaine est la source de vérité de son contrat.** Cette spécification ne recopie pas les signatures : une copie cesse d'être exacte dès que le port évolue. Pour connaître les méthodes d'un port, lire le fichier lié dans le tableau ci-dessus. Les règles qu'une signature ne dit pas (atomicité, cas « introuvable », ce que l'appelant doit nettoyer) sont écrites en commentaire sur la méthode, dans ce même fichier.

Quand un domaine est ajouté, supprimé ou qu'un port change de nom, mettre à jour le tableau dans le même changeset.

Conventions communes à tous les ports :

- Un port n'expose que des types du dossier `domain/` et les types d'options qu'il déclare lui-même (filtres, pagination), jamais un type Prisma ou Express.
- Les types `Create<X>Input` et `Update<X>Input` excluent `createdAt`, `updatedAt` et `deletedAt` : ces champs sont gérés par la persistance et par le cas d'usage de suppression.
- `softDelete(id)` marque l'entité comme supprimée (`deletedAt`) ; `delete(id)` la retire définitivement. Un port n'expose que les opérations dont ses cas d'usage ont besoin.
- Une recherche par identifiant retourne `null` quand l'entité n'existe pas ; c'est le cas d'usage qui lève l'erreur de domaine.

### Authentification et guards

Le JWT ne prouve que l'**identité** (`userId`, `iat`). À chaque requête authentifiée, le security handler relit en base l'état du compte et les droits (`isAdmin`, `isCoach`) : le `TokenPayload` fourni aux guards vient de la base, jamais des claims du token. La requête est refusée en `401` si le compte n'existe plus, est inactif ou bloqué, ou si le token a été émis avant `User.tokensValidAfter` (reset de mot de passe). Une rétrogradation, un blocage ou un retrait de coach prend donc effet immédiatement. Les guards sont dans `src/auth/application/requireRoles.ts` :

```ts
// Retourne le payload de la requête authentifiée ; lève UnauthorizedError s'il est absent
getAuthPayload(ctx: Context): TokenPayload

// Lève ForbiddenError si isAdmin est false
requireAdmin(ctx: Context): void

// Lève ForbiddenError si isAdmin et isCoach sont tous les deux false
requireAdminOrCoach(ctx: Context): void

// Retourne l'userId du payload
getAuthUserId(ctx: Context): string
```

Pour les vérifications de propriété (ex. coach → son équipe), les handlers appellent directement `UserTeamUseCases.hasRole()` ou `UserMatchUseCases.isReferee()` — la vérification passe par la base de données.

---

## Frontend

### Structure par feature module

```text
src/<Feature>/
├── domain/
│   └── <Entity>.ts            # Re-export des types SDK + types métier dérivés
├── infrastructure/
│   └── <entity>Repository.ts  # Alias stables des hooks orval
├── application/
│   └── use<Entity>*.ts        # Hooks métier (logique, pagination, états)
└── ui/
    └── ...                    # Composants purs (props uniquement, sans hooks SDK)
```

### Règles de dépendance

```text
ui/          →  application/ uniquement
application/ →  infrastructure/ + domain/
infrastructure/ →  @Sdk (hooks orval générés)
domain/      →  @Sdk (re-export types uniquement)
```

> Les composants `ui/` ne doivent **jamais** importer directement depuis `@Sdk`.

### Couche `infrastructure/` — pourquoi ?

Les hooks orval sont régénérés depuis `openapi.yml`. La couche `infrastructure/` crée une indirection stable :

```ts
// src/Teams/infrastructure/teamRepository.ts
export { useGetTeams as useTeamListQuery } from "@Sdk"
export { useCreateTeam as useCreateTeamMutation } from "@Sdk"
```

Si orval renomme un hook, seul ce fichier change.

### Couche `domain/` — pourquoi ?

Re-exporte les types SDK sous des noms métier stables et ajoute les types dérivés propres au frontend :

```ts
// src/Teams/domain/Team.ts
export type { Team } from "@Sdk"
export type TeamId = string
```

---

## État d'avancement

La migration est terminée des deux côtés. Il n'y a pas de tableau de statut à tenir à jour : le code fait foi.

- **Backend** : tous les domaines du tableau [Domaines et ports](#domaines-et-ports) suivent la structure hexagonale et ont leurs tests unitaires. Le dossier `backend/controllers/` n'existe plus ; les handlers de chaque domaine sont enregistrés dans `backend/createApp.ts`.
- **Frontend** : les feature modules de `frontend/web-application/src/` sont découpés en couches : `AgeCategory`, `Area`, `Auth`, `Championship`, `Dashboard`, `Game`, `Match`, `Player`, `Season`, `Teams`, `User`. Un module peut ne pas avoir toutes les couches (`Dashboard` n'a pas d'`infrastructure/`, `Player` n'a pas de `domain/`). `Admin`, `Calendar` et `Settings` ne contiennent que des pages et de la mise en page, sans couches.
