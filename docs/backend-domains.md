# Backend Domain Documentation

## Overview

This backend follows **Hexagonal Architecture (Ports & Adapters pattern)** with 11 distinct domains. Each domain is organized into 4 layers:

1. **Domain Layer** (`domain/`) — Core business logic, entity types, and domain errors
2. **Ports Layer** (`ports/`) — Interface contracts (repository/service interfaces)
3. **Application Layer** (`application/`) — Use cases and orchestration logic
4. **Infrastructure Layer** (`infrastructure/`) — Prisma repository implementations and HTTP handlers

**Stack**:

- Framework: Express v5
- API Contract: OpenAPI 3.1.0 (`openapi.yml`)
- Database: MongoDB via Prisma ORM
- Authentication: JWT (`JwtAuthService`)
- Request Validation: `openapi-backend` + Ajv

All domains are registered in `index.ts` and their HTTP handlers are wired into the OpenAPI backend.

---

## Domains

### 1. Auth

**Purpose**: User authentication, JWT token generation, password hashing, and role-based access control.

**Location**: `src/auth/`

| Layer          | Files                                      | Key content                                                                                     |
| -------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| domain         | `User.ts`, `AuthErrors.ts`                 | `TokenPayload`, `LoginResult`, `InvalidCredentialsError`, `UnauthorizedError`, `ForbiddenError` |
| ports          | `IAuthService.ts`                          | Token generation/verification, password hashing/comparison                                      |
| application    | `AuthUseCases.ts`, `requireRoles.ts`       | `login()`, `me()`, `getAuthPayload()`, `requireAdmin()`, `getAuthUserId()`                      |
| infrastructure | `JwtAuthService.ts`, `AuthHttpHandlers.ts` | JWT + bcrypt impl, handlers: `login`, `logout`, `me`, `forgotPassword`                          |

**OpenAPI operations**:

- `POST /login` — Login with email/password (no auth)
- `POST /logout` — Logout
- `GET /me` — Get current user profile
- `POST /forgot-password` — Password reset (returns 501)

---

### 2. User

**Purpose**: User account management, profiles, and registration.

**Location**: `src/user/`

| Layer          | Files                                            | Key content                                                                            |
| -------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------- |
| domain         | `User.ts`, `UserErrors.ts`                       | `UserProfile`, `CreateUserInput`, `UpdateUserInput`, `UserNotFoundError`               |
| ports          | `IUserRepository.ts`                             | `findById`, `findByEmailWithPassword`, `findAll`, `create`, `update`, `delete`         |
| application    | `UserUseCases.ts`                                | Full CRUD use cases                                                                    |
| infrastructure | `PrismaUserRepository.ts`, `UserHttpHandlers.ts` | Prisma impl, handlers: `getUsers`, `getUser`, `createUser`, `updateUser`, `removeUser` |

**OpenAPI operations**:

- `GET /users` — List users (paginated)
- `GET /users/{id}` — Get user by ID
- `POST /user` — Create user
- `PATCH /user/{id}` — Update user
- `DELETE /user/{id}` — Delete user

---

### 3. Team

**Purpose**: Team management, team rosters, and team calendars.

**Location**: `src/team/`

| Layer          | Files                                            | Key content                                                                                                                               |
| -------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| domain         | `Team.ts`, `TeamErrors.ts`                       | `Team`, `CreateTeamInput`, `UpdateTeamInput`, `TeamNotFoundError`                                                                         |
| ports          | `ITeamRepository.ts`                             | CRUD + `findPlayers()`, `findCalendar()`, `TeamPlayersOptions`, `TeamCalendarOptions`, `GameSummary`                                      |
| application    | `TeamUseCases.ts`                                | `count`, `getAll`, `getById`, `create`, `update`, `delete`, `getPlayers`, `getCalendar`                                                   |
| infrastructure | `PrismaTeamRepository.ts`, `TeamHttpHandlers.ts` | Prisma impl, handlers: `countTeams`, `getTeams`, `getTeam`, `createTeam`, `updateTeam`, `removeTeam`, `getTeamPlayers`, `getTeamCalendar` |

**Key types**: `Team { id, name, color? }`, `GameSummary { id, date, teams[] }`

**OpenAPI operations**:

- `GET /teams` — List all teams
- `GET /teams/count` — Count teams
- `GET /team/{id}` — Get team by ID
- `POST /team` — Create team (admin only)
- `PATCH /team/{id}` — Update team (admin only)
- `DELETE /team/{id}` — Delete team (admin only)
- `GET /team/{teamId}/players` — Get team roster (paginated)
- `GET /team/{teamId}/calendar` — Get team match schedule (with date filtering)

---

### 4. Player

**Purpose**: Player profiles within teams — jersey numbers, positions.

**Location**: `src/player/`

| Layer          | Files                          | Key content                                                                   |
| -------------- | ------------------------------ | ----------------------------------------------------------------------------- |
| domain         | `Player.ts`, `PlayerErrors.ts` | `Player { id, userId, teamId, jersey?, position? }`, `PlayerNotFoundError`    |
| ports          | `IPlayerRepository.ts`         | `findById`, `findByUserAndTeam`, `findByUserId`, `create`, `update`, `delete` |
| application    | `PlayerUseCases.ts`            | CRUD use cases                                                                |
| infrastructure | `PrismaPlayerRepository.ts`    | Prisma impl (no separate HTTP handler file — routes via UserTeam or inline)   |

**OpenAPI operations**:

- `POST /user/{userId}/player` — Create player profile for a user in a team

---

### 5. Match

**Purpose**: Match/game scheduling, results, and management.

**Location**: `src/match/`

| Layer          | Files                                              | Key content                                                                                                                                     |
| -------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| domain         | `Match.ts`, `MatchErrors.ts`                       | `MatchStatus` enum, `MatchArea`, `Match`, `CreateMatchInput`, `UpdateMatchInput`, `MatchNotFoundError`                                          |
| ports          | `IMatchRepository.ts`                              | CRUD + `findByGroupId()`                                                                                                                        |
| application    | `MatchUseCases.ts`                                 | Standard CRUD use cases                                                                                                                         |
| infrastructure | `PrismaMatchRepository.ts`, `MatchHttpHandlers.ts` | Prisma impl, handlers: `getMatches`, `getMatch`, `createMatch`, `updateMatch`, `removeMatch`, `countMatches`, `getTeamGames`, `getGamesByMonth` |

**Key types**:

- `MatchStatus`: `SCHEDULED | PLAYED | FORFEITED | CANCELLED`
- `Match`: `id, groupId, status, scheduledAt, area, homeTeamId, awayTeamId, homeGoals, awayGoals, forfeitedBy`
- `MatchArea`: `id, name, address, city, longitude, latitude`

**OpenAPI operations**:

- `GET /matches` — List matches (paginated)
- `GET /matches/count` — Count matches
- `GET /match/{id}` — Get match by ID
- `POST /match` — Create match
- `PATCH /match/{id}` — Update match
- `DELETE /match/{id}` — Delete match
- `GET /games/{year}/{month}` — Games for a specific month
- `GET /games` / `GET /games/count` — List/count all games
- `GET /team/{teamId}/games` — Team's games

---

### 6. Championship

**Purpose**: Tournament/championship management with age categories and points configuration.

**Location**: `src/championship/`

| Layer          | Files                                                            | Key content                                                                     |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| domain         | `Championship.ts`, `ChampionshipErrors.ts`                       | `AgeCategory` enum, `PointsConfig`, `Championship`, `ChampionshipNotFoundError` |
| ports          | `IChampionshipRepository.ts`                                     | CRUD + `count()`, pagination                                                    |
| application    | `ChampionshipUseCases.ts`                                        | `count`, `getAll`, `getById`, `create`, `update`, `delete`                      |
| infrastructure | `PrismaChampionshipRepository.ts`, `ChampionshipHttpHandlers.ts` | Prisma impl, CRUD handlers                                                      |

**Key types**:

- `AgeCategory`: `U9 | U11 | U13 | U15 | U18 | Senior`
- `PointsConfig`: `{ win, draw, loss, forfeit }` (integer points)
- `Championship`: `id, name, ageCategory, season, startDate, endDate, pointsConfig`

**OpenAPI operations**:

- `GET /championships` — List championships (paginated, no auth)
- `GET /championships/count` — Count (no auth)
- `GET /championship/{id}` — Get by ID (no auth)
- `POST /championship` — Create
- `PATCH /championship/{id}` — Update
- `DELETE /championship/{id}` — Delete
- `GET /championship/{championshipId}/phases` — Get phases (no auth)

---

### 7. Phase

**Purpose**: Tournament phases (GROUP or KNOCKOUT stages) within a championship.

**Location**: `src/phase/`

| Layer          | Files                                              | Key content                                                       |
| -------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| domain         | `Phase.ts`, `PhaseErrors.ts`                       | `PhaseType` enum (GROUP, KNOCKOUT), `Phase`, `PhaseNotFoundError` |
| ports          | `IPhaseRepository.ts`                              | `findByChampionshipId`, `findById`, CRUD                          |
| application    | `PhaseUseCases.ts`                                 | Phase management use cases                                        |
| infrastructure | `PrismaPhaseRepository.ts`, `PhaseHttpHandlers.ts` | Prisma impl, HTTP handlers                                        |

**Key types**: `Phase { id, championshipId, type, order, name }`

**OpenAPI operations**:

- `GET /phase/{id}` — Get phase (no auth)
- `POST /phase` — Create
- `PATCH /phase/{id}` — Update
- `DELETE /phase/{id}` — Delete
- `GET /phase/{phaseId}/groups` — Get groups in a phase (no auth)

---

### 8. Group

**Purpose**: Tournament groups/pools (poules) with match modes.

**Location**: `src/group/`

| Layer          | Files                                              | Key content                                                             |
| -------------- | -------------------------------------------------- | ----------------------------------------------------------------------- |
| domain         | `Group.ts`, `GroupErrors.ts`                       | `MatchMode` enum (SINGLE, HOME_AND_AWAY), `Group`, `GroupNotFoundError` |
| ports          | `IGroupRepository.ts`                              | `findByPhaseId`, `findById`, CRUD                                       |
| application    | `GroupUseCases.ts`                                 | Group management use cases                                              |
| infrastructure | `PrismaGroupRepository.ts`, `GroupHttpHandlers.ts` | Prisma impl, HTTP handlers                                              |

**Key types**: `Group { id, phaseId, name, matchMode, teamIds[] }`

**OpenAPI operations**:

- `GET /group/{id}` — Get group (no auth)
- `POST /group` — Create
- `PATCH /group/{id}` — Update
- `DELETE /group/{id}` — Delete
- `GET /group/{groupId}/standings` — Get group standings (no auth)

---

### 9. Standings

**Purpose**: Calculate and retrieve league table standings based on match results.

**Location**: `src/standings/`

| Layer          | Files                                                      | Key content                                                          |
| -------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- |
| domain         | `Standing.ts`                                              | `StandingRow`, `GroupStandings` (computed, not stored in DB)         |
| ports          | `IStandingsRepository.ts`                                  | `findMatchesByGroupId()`, `findGroupContext()`                       |
| application    | `StandingsUseCases.ts`, `StandingsCalculator.ts`           | `getGroupStandings()` use case, `calculateStandings()` pure function |
| infrastructure | `PrismaStandingsRepository.ts`, `StandingsHttpHandlers.ts` | Fetches matches + group context, `getGroupStandings` handler         |

**Key types**:

- `StandingRow`: `rank, teamId, played, won, drawn, lost, forfeited, goalsFor, goalsAgainst, goalDifference, points`
- `GroupStandings`: `groupId, rows[]`

**Calculation rules**:

- `SCHEDULED` / `CANCELLED` matches are ignored
- `FORFEITED`: winner gets 3 pts, loser gets `forfeit` pts from `PointsConfig`
- `PLAYED`: Win = `win` pts, Draw = `draw` pts, Loss = `loss` pts
- Ranking: points desc → goal difference desc → goals for desc

**OpenAPI operations**:

- `GET /group/{groupId}/standings` — Get standings for a group (no auth)

---

### 10. UserTeam

**Purpose**: Associating users with teams in specific roles (COACH, PLAYER).

**Location**: `src/userTeam/`

| Layer          | Files                                                    | Key content                                                                                 |
| -------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| domain         | `UserTeam.ts`, `UserTeamErrors.ts`                       | `TeamRole` enum (COACH, PLAYER), `UserTeam`, `CreateUserTeamInput`, `UserTeamNotFoundError` |
| ports          | `IUserTeamRepository.ts`                                 | `assign`, `remove`, `findByTeamAndRole`, `findByUserAndRole`, `hasRole`                     |
| application    | `UserTeamUseCases.ts`                                    | `assignCoach`, `removeCoach`, `getCoachTeams`, `getTeamCoaches`                             |
| infrastructure | `PrismaUserTeamRepository.ts`, `UserTeamHttpHandlers.ts` | Prisma impl, HTTP handlers                                                                  |

**Key constraint**: `(userId, teamId, role)` is unique — a user can be both COACH and PLAYER of the same team.

**OpenAPI operations**:

- `POST /team/{teamId}/player/{userId}` — Add player to team
- `GET /team/{teamId}/coaches` — List team coaches
- `POST /team/{teamId}/coach/{userId}` — Assign coach
- `DELETE /team/{teamId}/coach/{userId}` — Remove coach
- `GET /user/{userId}/coach-teams` — Teams managed by a coach

---

### 11. UserMatch

**Purpose**: Assigning referees to matches.

**Location**: `src/userMatch/`

| Layer          | Files                                                      | Key content                                                   |
| -------------- | ---------------------------------------------------------- | ------------------------------------------------------------- |
| domain         | `UserMatch.ts`, `UserMatchErrors.ts`                       | `UserMatch`, `CreateUserMatchInput`, `UserMatchNotFoundError` |
| ports          | `IUserMatchRepository.ts`                                  | `assign`, `remove`, `findByMatch`, `findByUser`, `isReferee`  |
| application    | `UserMatchUseCases.ts`                                     | Referee assignment use cases                                  |
| infrastructure | `PrismaUserMatchRepository.ts`, `UserMatchHttpHandlers.ts` | Prisma impl, HTTP handlers                                    |

**Key constraint**: `(userId, matchId)` is unique — a user can only referee a match once.

**OpenAPI operations**:

- `GET /match/{matchId}/referees` — List referees for a match
- `POST /match/{matchId}/referee/{userId}` — Assign referee
- `DELETE /match/{matchId}/referee/{userId}` — Remove referee
- `GET /user/{userId}/referee-matches` — Matches where user is referee

---

## Database Schema (Prisma + MongoDB)

| Prisma Model   | MongoDB Collection | Description                                    |
| -------------- | ------------------ | ---------------------------------------------- |
| `User`         | users              | System users with auth                         |
| `Championship` | championships      | Tournaments with age categories                |
| `Phase`        | phases             | Tournament phases (GROUP/KNOCKOUT)             |
| `Group`        | `poules`           | Tournament groups/pools                        |
| `Team`         | teams              | Sports teams                                   |
| `Player`       | `players`          | User-team association with jersey/position     |
| `Match`        | `games`            | Matches with scores and embedded area          |
| `UserTeam`     | `userTeams`        | User-team role assignments                     |
| `UserMatch`    | `userMatches`      | Referee assignments                            |
| `Area`         | areas              | Physical locations for matches                 |
| `EmbeddedArea` | (type)             | Denormalized area snapshot embedded in matches |

**Key relationships**:

```text
Championship → Phase (one-to-many)
  Phase → Group (one-to-many)
    Group → Match (one-to-many)
Team → Player, UserTeam (one-to-many)
User → Player, UserTeam, UserMatch (one-to-many)
Match → UserMatch (one-to-many)
```

---

## Application Initialization (`index.ts`)

**Middleware stack** (in order):

1. Express JSON parser
2. Helmet (security headers)
3. CORS (whitelist `FRONTEND_URL`)
4. Rate limiting on `/login` (10 req / 15 min)
5. Morgan (HTTP logging)

**OpenAPI Backend**:

- Loads `openapi.yml` as the contract
- Registers JWT security handler
- Registers all 11 domain HTTP handler sets
- Validates requests/responses against spec (Ajv with custom formats: `color`, `score`)

**Startup sequence**:

1. Prisma client connects to MongoDB
2. Express server starts after DB connection confirmed

---

## Testing

**Framework**: Vitest — unit tests co-located with source as `*.test.ts`

| Test file                                                   | Domain       |
| ----------------------------------------------------------- | ------------ |
| `src/auth/application/requireRoles.test.ts`                 | Auth         |
| `src/user/application/UserUseCases.test.ts`                 | User         |
| `src/team/application/TeamUseCases.test.ts`                 | Team         |
| `src/player/application/PlayerUseCases.test.ts`             | Player       |
| `src/match/application/MatchUseCases.test.ts`               | Match        |
| `src/championship/application/ChampionshipUseCases.test.ts` | Championship |
| `src/phase/application/PhaseUseCases.test.ts`               | Phase        |
| `src/group/application/GroupUseCases.test.ts`               | Group        |
| `src/standings/application/StandingsCalculator.test.ts`     | Standings    |
| `src/userTeam/application/UserTeamUseCases.test.ts`         | UserTeam     |
| `src/userMatch/application/UserMatchUseCases.test.ts`       | UserMatch    |

---

## Environment Variables

| Variable       | Description                                 |
| -------------- | ------------------------------------------- |
| `DATABASE_URL` | MongoDB connection string                   |
| `JWT_SECRET`   | Secret key for JWT signing                  |
| `JWT_EXPIRE`   | Token expiration in seconds (default: 7200) |
| `PORT`         | Server port                                 |
| `FRONTEND_URL` | Allowed CORS origin                         |
| `NODE_ENV`     | `development` / `production`                |

---

## Error Handling

| Status | Meaning                        |
| ------ | ------------------------------ |
| 400    | Validation error (OpenAPI/Ajv) |
| 401    | Missing or invalid JWT         |
| 403    | Insufficient permissions       |
| 404    | Resource not found             |
| 405    | Method not allowed             |
| 500    | Internal server error          |
