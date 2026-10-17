# Dépannage de l'environnement local

Chaque entrée part d'un symptôme observé, donne la cause établie et le correctif. Ce ne sont pas des bugs de l'application : vérifier ces causes avant de chercher dans le code.

Pour « j'ai changé X et rien ne bouge » côté web-app, suivre d'abord la checklist de `CLAUDE.md` › Debugging checklist (design system construit, cache `.vite`, client Prisma).

## Web-app

### Une modification du design system reste invisible malgré le rebuild et la suppression de `.vite`

- **Cause** : le serveur Vite déjà lancé garde en mémoire son graphe de dépendances optimisées. Supprimer `node_modules/.vite` pendant qu'il tourne ne change rien.
- **Correctif** : arrêter le processus (`lsof -iTCP:5173 -sTCP:LISTEN -t`, puis `kill <pid>`) et relancer `pnpm --filter application-material dev`.

### Les e2e mockés redirigent vers `/auth/signin` en cours de test

- **Cause** : un `vite` lancé hors Playwright, sans `--mode e2e`, écoute déjà sur `:5173`. `playwright.config.ts` a `reuseExistingServer: !process.env.CI` : il réutilise ce serveur, où MSW n'est pas actif. Les requêtes partent vers le vrai backend, le faux jeton reçoit un `401`, et l'intercepteur axios renvoie vers la connexion.
- **Diagnostic** : `lsof -iTCP:5173 -sTCP:LISTEN`, puis regarder à quel dossier appartient le processus.
- **Correctif** : arrêter ce `vite` avant de lancer les e2e. Si c'est le serveur de travail d'un autre checkout, ne pas l'arrêter : lancer Playwright avec une configuration temporaire qui pointe `baseURL` et `webServer` vers un port libre (`vite --mode e2e --port 5199 --strictPort`, `reuseExistingServer: false`), puis la supprimer.

## Worktree neuf

Un worktree créé à côté du checkout principal ne contient ni dépendances ni fichiers ignorés par git.

| Symptôme                                                                  | Cause                                                                    | Correctif                                                                                                                                                                     |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Les tests ou le build ne trouvent pas leurs modules                       | Aucun `node_modules`, pas de `dist/` du design system ni de form-factory | `pnpm install --frozen-lockfile` à la racine, dans `backend/` et dans `frontend/`, puis `pnpm --filter @repo/design-system build` et `pnpm --filter @repo/form-factory build` |
| Le commit échoue sur `commitlint` ou sur le hook `pre-commit`             | Dépendances racine ou `backend/node_modules` absentes                    | Installer comme ci-dessus. Ne jamais passer `--no-verify`                                                                                                                     |
| `generate:prisma` : `Missing required environment variable: DATABASE_URL` | Pas de `backend/.env` (ignoré par git)                                   | `cp backend/.env.sample backend/.env`                                                                                                                                         |
| Le frontend ne compile pas (`@Sdk/...` introuvable)                       | `src/sdk/` est ignoré par git                                            | `pnpm --filter application-material gen:sdk` depuis `frontend/`, après chaque changement de branche qui touche `openapi.yml`                                                  |

## Backend et base de données

### `db push` échoue avec `Error code 14031 (OutOfDiskSpace)`

- **Cause** : le disque de la VM Docker Desktop est presque plein (moins de 500 Mo libres). Ni le schéma ni des doublons ne sont en cause.
- **Diagnostic** : `docker system df`. Le cache de build est souvent le plus gros poste.
- **Correctif** : `docker builder prune -f` vide le cache de build sans toucher aux volumes. Ne jamais lancer `docker system prune --volumes` : la base de dev vit dans les volumes `deployment_mongodb-data` et `deployment_mongodb-config`.

### `make seed` réussit, mais la base visée reste vide

- **Cause** : les écritures sont parties dans une autre base. Cas rencontré : une URL MongoDB non quotée dans une recette du `Makefile`. Le shell coupe la commande au `&` de l'URL, et le seed tourne sans `DATABASE_URL`, donc sur `backend/.env` (la base de dev). Corrigé par #34.
- **Diagnostic** : chercher les documents fraîchement créés dans les autres bases avant de soupçonner un problème de timing.
- **Correctif** : quoter toute variable injectée dans une recette shell (voir `specifications/00-conventions.md` › Process).

### `vitest run` du backend se fige avant la bannière `RUN`

- **Cause connue** : `rolldown@1.0.0-rc.16` (tiré par `vite@8.0.9`) bloquait parfois au bundling de `vitest.config.ts`. Corrigé par `"vite": "^8.3.3"` dans `backend/package.json` (#125).
- **Diagnostic** : vérifier que `backend/pnpm-lock.yaml` n'est pas revenu sur un `rolldown@1.0.0-rc.*`. Si le blocage revient malgré cela, capturer `sample <pid> 2` sur le processus avant de l'arrêter, puis ouvrir une issue.

### Les tests fonctionnels restent bloqués au démarrage

- **Symptôme** : le journal reste presque vide après plusieurs minutes, et `docker ps` ne montre aucun conteneur `prismagraphql/mongo-single-replica`. Une suite saine dure environ deux minutes.
- **Correctif** : arrêter le run et le relancer. La cause n'est pas établie.
- **Cas voisin** : un test isolé qui répond `404` une fois puis passe en relance relève de la course d'écriture Prisma/MongoDB décrite dans `backend/tests/support/database.ts`. Relancer avant d'enquêter.
