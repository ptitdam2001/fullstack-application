# ADR-0003 — Tests E2E frontend : Playwright + MSW (mode mocked)

**Date** : 2026-06-17  
**Statut** : Accepté

---

## Contexte

Le projet dispose déjà de tests unitaires (Vitest/jsdom) et de play functions Storybook pour les composants isolés. Il manque une couche de vérification des parcours utilisateur assemblés : routing, guards d'authentification, persistance JWT, navigation entre pages.

Playwright 1.58.2 est déjà déclaré dans `package.json` (sans config active). MSW est déjà en place côté frontend (`src/mocks/`), activé en mode dev (MSW ne démarre pas si `import.meta.env.PROD` ou `VITE_MOCKED_BACKEND=false`).

## Décision

**Playwright + MSW en mode développement** pour tous les tests E2E de la Session 4.

- Le serveur de test est lancé avec `pnpm --filter application-material dev` (Vite dev, pas `vite preview`) : MSW Service Worker s'active automatiquement, aucun backend réel nécessaire.
- baseURL : `http://localhost:5173` (port Vite par défaut).
- Deux projets Playwright : `setup` (injection auth) + `chromium` (tests, dépend de `setup`).
- L'état d'authentification est injecté directement dans `localStorage['user']` (bypass UI login dans le projet `setup`), puis sauvegardé via `storageState`. Le projet `chromium` réutilise cet état pour chaque spec.
- Le projet `setup` teste également le flux login UI dans `e2e/auth.spec.ts`.

## Storybook vs Playwright — complémentarité (rappel ADR-0001)

| Critère              | Storybook (play functions)               | Playwright                                                    |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------- |
| Granularité          | Composant isolé                          | Application assemblée (routing, guards, état global)          |
| Couvre               | États visuels, interactions kbd/souris   | Routing, guards auth, persistance JWT, navigation inter-pages |
| Ne couvre pas        | Navigation, auth, appels réseau réels    | Micro-interactions d'un composant (trop coûteux à isoler)     |
| Environnement        | jsdom / browser via Vitest               | Vrai navigateur Chromium headless                             |

Les deux outils sont complémentaires et non substituables.

## Alternatives rejetées

- **`vite preview` (build de production)** : `import.meta.env.PROD=true` désactive MSW — nécessiterait une modification de `main.tsx` ou un build spécial. Complexité inutile pour la phase mocked.
- **Backend réel en CI** : Réservé à la Session 5 (smoke full-stack, `docker-compose.test.yml`).
- **Cypress** : Non retenu — Playwright déjà installé, meilleure ergonomie TypeScript, support `storageState` natif.

## Conséquences

- `e2e/` sous `frontend/web-application/` ; fichier de state auth dans `e2e/.auth/` (gitignore).
- Script `test:e2e` ajouté dans `package.json`.
- Cible `make test-e2e` ajoutée.
- MSW Service Worker (`public/mockServiceWorker.js`) déjà présent — aucune action requise.
- Session 5 : smoke full-stack avec `docker-compose.test.yml` + projet Playwright `smoke` séparé (ADR futur).