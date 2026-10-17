# Conventions transverses

Ce fichier regroupe les règles qui valent pour tout le projet, quel que soit le domaine métier. Il ne recopie pas les règles déjà écrites ailleurs : il renvoie vers elles.

Une règle qu'un outil peut vérifier vit dans cet outil (ESLint, Prettier, script de contrôle), pas seulement ici. La colonne « Appliquée par » le dit pour chaque règle.

## Où trouver les autres règles

| Sujet                                                          | Fichier                                   |
| -------------------------------------------------------------- | ----------------------------------------- |
| Format des erreurs, pagination des listes, suppression logique | `07-technical-choices.md`                 |
| Couches hexagonales, ports, règle de dépendance                | `08-architecture-hexagonale.md`           |
| Formulaires `@repo/form-factory`                               | `15-form-factory.md`                      |
| Pyramide de test, nommage des tests, matrices de couverture    | `16-strategie-de-test.md`                 |
| Commandes, pièges connus, synchronisation des contrats         | `CLAUDE.md` (racine), `backend/CLAUDE.md` |
| Composants du design system                                    | `frontend/design-system/CLAUDE.md`        |
| Dépannage de l'environnement local                             | `docs/troubleshooting.md`                 |

## Backend

| Règle                                                                                                                                                                                                                                                                                                                                       | Appliquée par                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Accolades sur tout bloc `if` / `else`, même d'une ligne.                                                                                                                                                                                                                                                                                    | ESLint `curly` (`tooling/eslint-config/base.js`) |
| Un filtre qui remonte une chaîne de relations Prisma s'écrit en un seul `where` imbriqué (ex. `group: { phase: { championship: { ageCategoryId } } }`), pas en résolvant les ids repository par repository. MongoDB le supporte sur 3 niveaux (`PrismaMatchRepository`). Un test fonctionnel le prouve, un repository mocké ne prouve rien. | Revue                                            |
| Un paramètre de requête déclaré dans `openapi.yml` doit être lu par le handler. `openapi-backend` valide les paramètres mais ne vérifie pas qu'ils servent : seul un test fonctionnel qui fait varier le paramètre le prouve (cas de `GET /teams`, #95).                                                                                    | Test fonctionnel                                 |

## Frontend

| Règle                                                                                                                                                                                                                                                                                                                                                       | Appliquée par                  |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Pas d'import de `react-aria-components` dans la web-app : passer par `@repo/design-system`.                                                                                                                                                                                                                                                                 | ESLint `no-restricted-imports` |
| `formatMessage` reçoit un descripteur `{ id: '...' }`, jamais un id nu. Un id nu passe `tsc` mais lève `An id must be provided to format a message` au rendu.                                                                                                                                                                                               | ESLint `no-restricted-syntax`  |
| Un composant de `src/<Feature>/ui/` garde un `.tsx` en JSX pur. L'état, les effets, les handlers et les appels aux hooks d'application vont dans un hook de façade co-localisé `use<Component>.ts` (ex. `Auth/ui/AccountPhoto/useAccountPhoto.ts`).                                                                                                         | Revue, skill `react-component` |
| Un sous-composant utilisé par un seul composant va dans `<Component>/components/` (ex. `Championship/ui/MatchesPanel/components/`). Un sous-composant partagé par un même domaine reste dans `src/<Feature>/ui/` ; il ne remonte dans `@Common` que s'il sert plusieurs domaines, et jamais dans le design system, qui ne contient pas de composant métier. | Revue                          |
| Une couleur ciblée se pose sur le composant le plus étroit qui la porte (ex. `TopBar`), pas sur un wrapper de layout du design system (`Layout.Header`) qui enveloppe aussi d'autres zones.                                                                                                                                                                 | Revue                          |
| Après `gen:sdk`, un nouveau tag OpenAPI produit `src/sdk/generated/<tag>/<tag>.msw.ts`. Son `get<Tag>Mock()` doit être ajouté à la main dans `src/mocks/handlers.ts`, sinon la page reste vide en dev mocké et en e2e, sans erreur.                                                                                                                         | Revue, skill `openapi-sync`    |

## Tests

| Règle                                                                                                                                                                                                                                                                  | Appliquée par                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Cibler un élément d'abord par son rôle (et son nom accessible), puis par un attribut sémantique (`aria-*`, `data-*`), puis par `data-testid`. Jamais par une classe CSS.                                                                                               | ESLint `no-restricted-syntax` (classes CSS) |
| Un test RTL de la web-app passe par un Page Object co-localisé `<Component>.page.tsx` : classe, getters nommés par intention, actions chaînables, callbacks exposés en `vi.fn()`. Les `vi.mock` restent dans le `.test.tsx`. Référence : `Season/ui/Admin/*.page.tsx`. | Revue, skill `react-component`              |
| Un formulaire `createFormFactory` n'a pas de `.test.tsx` : il est testé par les plays de sa story, à travers un Page Object `<Component>.page.ts` qui enveloppe `within(canvasElement)`. Référence : `Auth/ui/ForgottenPasswordForm/ForgottenPasswordForm.page.ts`.    | Revue, skill `create-form`                  |
| Dans un play Storybook, un texte traduit se cherche avec une regex bilingue (`/delete\|supprimer/i`) : Chromium headless rend la locale `en-US`, pas `fr`.                                                                                                             | Revue                                       |
| En e2e mocké, une réponse d'API déterministe passe par `mockMsw()` / `applyMswOverride()` (`e2e/mockMsw.ts`). `page.route()` ne voit pas ces appels : le service worker MSW y répond avant.                                                                            | ESLint `no-restricted-syntax`               |
| Un test de chemin d'erreur vérifie un effet visible de l'erreur (toast, message), pas seulement l'absence de l'effet de succès.                                                                                                                                        | Revue                                       |
| Un test qui prouve un correctif doit échouer sur le code d'avant le correctif.                                                                                                                                                                                         | Revue                                       |

## Process

| Règle                                                                                                                                                                                                                                                                                                | Appliquée par               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Un point mis de côté pendant une tâche devient une issue GitHub (titre et corps en français, sections Constat / Piste, fichiers précis, labels existants). Vérifier dans le code que le constat est toujours vrai et chercher les doublons avant de la créer. Une PR qui la règle écrit `Closes #N`. | Revue                       |
| Un correctif qui touche le CSS (débordement, `sticky`, espacements), la configuration du serveur ou un parcours en plusieurs étapes se vérifie dans un vrai navigateur. jsdom ne calcule pas la mise en page.                                                                                        | Revue                       |
| Dans une recette du `Makefile`, une variable injectée dans une commande shell est entre quotes si sa valeur peut contenir `&`, `;`, `?` ou une espace (ex. une URL MongoDB).                                                                                                                         | Revue                       |
| `.env.sample` change dans le même commit que toute variable ajoutée ou retirée de `.env`, avec des valeurs factices.                                                                                                                                                                                 | Revue, hook post-édition    |
| Toute modification de `openapi.yml` met à jour la collection Bruno (`backend/bruno/`) dans le même commit.                                                                                                                                                                                           | Revue, skill `openapi-sync` |
