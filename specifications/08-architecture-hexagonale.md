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
│   └── <Entity>UseCases.ts      # Use cases injectés via interface
└── infrastructure/
    ├── Prisma<Entity>Repository.ts  # Implémente le port via Prisma
    └── <Entity>HttpHandlers.ts      # Adaptateur HTTP Express
```

### Contrats d'interfaces par domaine

#### `ITeamRepository`

```ts
interface ITeamRepository {
  count(): Promise<number>;
  findAll(params: PaginationParams): Promise<Team[]>;
  findById(id: string): Promise<Team | null>;
  create(input: CreateTeamInput): Promise<Team>;
  update(id: string, input: UpdateTeamInput): Promise<Team>;
  delete(id: string): Promise<void>;
  findPlayers(teamId: string): Promise<Player[]>;
  findCalendar(teamId: string): Promise<Match[]>;
}
```

#### `IMatchRepository`

```ts
interface IMatchRepository {
  findAll(params: PaginationParams): Promise<Match[]>;
  findById(id: string): Promise<Match | null>;
  create(input: CreateMatchInput): Promise<Match>;
  update(id: string, input: UpdateMatchInput): Promise<Match>;
  updateScore(id: string, score: Score): Promise<Match>;
  findByChampionship(championshipId: string): Promise<Match[]>;
  assignReferee(matchId: string, refereeId: string): Promise<Match>;
}
```

#### `IChampionshipRepository`

```ts
interface IChampionshipRepository {
  findAll(): Promise<Championship[]>;
  findById(id: string): Promise<Championship | null>;
  create(input: CreateChampionshipInput): Promise<Championship>;
  update(id: string, input: UpdateChampionshipInput): Promise<Championship>;
  delete(id: string): Promise<void>;
  findPhases(championshipId: string): Promise<Phase[]>;
}
```

#### `IUserRepository`

```ts
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  update(id: string, input: UpdateUserInput): Promise<User>;
  delete(id: string): Promise<void>;
}
```

#### `IAuthService` _(port de service)_

```ts
interface IAuthService {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}
```

#### `IStandingsRepository`

```ts
interface IStandingsRepository {
  findByGroup(groupId: string): Promise<StandingsRow[]>;
  recalculate(groupId: string): Promise<StandingsRow[]>;
}
```

### Règle d'activation (strangler fig)

Chaque domaine migré est activé par **un seul changement d'import** dans `index.ts` :

```ts
// Avant (legacy)
import * as teamHandlers from "./controllers/teams";

// Après (hexagonal)
import * as teamHandlers from "./src/teams/infrastructure/TeamHttpHandlers";
```

Le fichier legacy reste sur disque jusqu'à validation complète.

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

> Les composants `ui/` ne doivent **jamais** importer directement depuis `@Sdk`. Toute la logique de fetching passe par la couche `application/`.

### Couche `infrastructure/` — pourquoi ?

Les hooks orval sont régénérés automatiquement depuis `openapi.yml`. Leurs noms peuvent changer. La couche `infrastructure/` crée une indirection stable :

```ts
// src/Teams/infrastructure/teamRepository.ts
export { useGetTeams as useTeamListQuery } from "@Sdk";
export { useGetTeamsCount as useTeamCountQuery } from "@Sdk";
export { useCreateTeam as useCreateTeamMutation } from "@Sdk";
```

Si orval renomme `useGetTeams` en `useListTeams`, seul ce fichier change.

### Couche `domain/` — pourquoi ?

Re-exporte les types SDK sous des noms métier stables et ajoute les types dérivés propres au frontend :

```ts
// src/Teams/domain/Team.ts
export type { Team, TeamWithoutId } from "@Sdk";
export type TeamId = string;
export type TeamListResult = { teams: Team[]; total: number };
```

### Exemple de flux complet

```text
TeamListPage (ui)
  └── useTeamList() (application)
        ├── useTeamListQuery() (infrastructure → @Sdk)
        └── useTeamCountQuery() (infrastructure → @Sdk)
```

---

## Ordre de migration des domaines

| Ordre | Domaine       | Complexité backend             | Complexité frontend           |
| ----- | ------------- | ------------------------------ | ----------------------------- |
| 1     | teams         | Moyenne                        | Haute (le plus de composants) |
| 2     | player        | Basse                          | Moyenne                       |
| 3     | users         | Moyenne                        | Basse                         |
| 4     | auth          | Haute (JWT + bcrypt)           | Moyenne                       |
| 5     | matches       | Moyenne                        | Moyenne                       |
| 6     | championships | Haute (phases, qualifications) | Haute                         |
| 7     | standings     | Basse (calcul Prisma)          | Moyenne                       |
