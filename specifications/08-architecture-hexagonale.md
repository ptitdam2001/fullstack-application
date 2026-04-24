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

### Domaines implémentés

| Domaine      | Description                                              |
| ------------ | -------------------------------------------------------- |
| `auth`       | Login, JWT, me                                           |
| `user`       | CRUD utilisateurs                                        |
| `team`       | CRUD équipes + joueurs + calendrier                      |
| `player`     | Profils joueurs (maillot, poste)                         |
| `match`      | CRUD matchs + scores                                     |
| `championship` | CRUD championnats                                      |
| `userTeam`   | Appartenance User ↔ Team avec rôle (COACH ou PLAYER)     |
| `userMatch`  | Assignation arbitres User ↔ Match                        |

### Contrats d'interfaces par domaine

#### `IUserRepository`

```ts
interface IUserRepository {
  findById(id: string): Promise<UserProfile | null>
  findByEmailWithPassword(email: string): Promise<(UserProfile & { password: string }) | null>
  findAll(): Promise<UserProfile[]>
  create(input: CreateUserInput): Promise<UserProfile>
  update(id: string, input: UpdateUserInput): Promise<UserProfile>
  delete(id: string): Promise<void>
}
```

#### `IAuthService` _(port de service)_

```ts
interface IAuthService {
  generateToken(userId: string, isAdmin: boolean): string
  verifyToken(token: string): TokenPayload
  hashPassword(password: string): Promise<string>
  comparePassword(password: string, hash: string): Promise<boolean>
}
```

#### `ITeamRepository`

```ts
interface ITeamRepository {
  count(): Promise<number>
  findAll(params: PaginationParams): Promise<Team[]>
  findById(id: string): Promise<Team | null>
  create(input: CreateTeamInput): Promise<Team>
  update(id: string, input: UpdateTeamInput): Promise<Team>
  delete(id: string): Promise<void>
  findPlayers(teamId: string, options: PaginationOptions): Promise<Player[]>
  findCalendar(teamId: string, options: CalendarOptions): Promise<Match[]>
}
```

#### `IPlayerRepository`

```ts
interface IPlayerRepository {
  findById(id: string): Promise<Player | null>
  findByUserAndTeam(userId: string, teamId: string): Promise<Player | null>
  findByUserId(userId: string): Promise<Player[]>
  create(input: CreatePlayerInput): Promise<Player>
  update(id: string, input: UpdatePlayerInput): Promise<Player>
  delete(id: string): Promise<void>
}
```

#### `IUserTeamRepository`

```ts
interface IUserTeamRepository {
  assign(userId: string, teamId: string, role: TeamRole): Promise<UserTeam>
  remove(userId: string, teamId: string, role: TeamRole): Promise<void>
  findByTeamAndRole(teamId: string, role: TeamRole): Promise<UserTeam[]>
  findByUserAndRole(userId: string, role: TeamRole): Promise<UserTeam[]>
  hasRole(userId: string, teamId: string, role: TeamRole): Promise<boolean>
}
```

#### `IUserMatchRepository`

```ts
interface IUserMatchRepository {
  assign(userId: string, matchId: string): Promise<UserMatch>
  remove(userId: string, matchId: string): Promise<void>
  findByMatch(matchId: string): Promise<UserMatch[]>
  findByUser(userId: string): Promise<UserMatch[]>
  isReferee(userId: string, matchId: string): Promise<boolean>
}
```

#### `IMatchRepository`

```ts
interface IMatchRepository {
  count(): Promise<number>
  findAll(options: PaginationOptions): Promise<Match[]>
  findById(id: string): Promise<Match | null>
  create(input: CreateMatchInput): Promise<Match>
  update(id: string, input: UpdateMatchInput): Promise<Match>
  delete(id: string): Promise<void>
}
```

#### `IChampionshipRepository`

```ts
interface IChampionshipRepository {
  count(): Promise<number>
  findAll(options: PaginationOptions): Promise<Championship[]>
  findById(id: string): Promise<Championship | null>
  create(input: CreateChampionshipInput): Promise<Championship>
  update(id: string, input: UpdateChampionshipInput): Promise<Championship>
  delete(id: string): Promise<void>
}
```

### Authentification et guards

Le JWT contient `{ userId, isAdmin }`. Deux guards sont disponibles dans `src/auth/application/requireRoles.ts` :

```ts
// Vérifie que le token est valide et retourne le payload
getAuthPayload(ctx: Context): TokenPayload

// Lève ForbiddenError si isAdmin est false
requireAdmin(ctx: Context): void

// Retourne l'userId du token
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

## État d'avancement backend

| Domaine        | Statut     | Tests |
| -------------- | ---------- | ----- |
| `auth`         | ✅ Complet | ✅    |
| `user`         | ✅ Complet | ✅    |
| `team`         | ✅ Complet | ✅    |
| `player`       | ✅ Complet | ✅    |
| `match`        | ✅ Complet | ✅    |
| `championship` | ✅ Complet | ✅    |
| `userTeam`     | ✅ Complet | ✅    |
| `userMatch`    | ✅ Complet | ✅    |
| `standings`    | ⏳ À faire | —     |

## État d'avancement frontend

| Feature        | Statut     |
| -------------- | ---------- |
| Auth           | ⏳ À faire |
| Teams          | ⏳ À faire |
| Players        | ⏳ À faire |
| Matches        | ⏳ À faire |
| Championships  | ⏳ À faire |
| Standings      | ⏳ À faire |
