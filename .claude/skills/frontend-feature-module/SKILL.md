---
name: frontend-feature-module
description: Scaffolds or completes a feature module in the web application following hexagonal frontend architecture (domain / infrastructure / application / ui layers + co-located unit tests). Use this skill whenever the user wants to create, add, or implement a frontend module or feature: "créer le module", "ajouter une feature", "scaffolder", "implémenter la page", "créer le module Championship/Standings/Player/...", "create module", "add feature". Always invoke this skill before writing any frontend feature module code from scratch.
---

# Frontend Feature Module

Architecture hexagonale frontend : domain → infrastructure → application → ui → pages.
Projet : `/Users/suhard/Documents/Development/fullstack-application/frontend/web-application/`
Specs métier : `specifications/` à la racine du monorepo.

---

## Étape 0 — Pré-requis

Avant d'écrire une ligne de code :

1. **Lire la spec métier** dans `specifications/` — trouver le fichier correspondant au domaine
2. **Vérifier que le SDK est à jour** — si des domaines backend ont été ajoutés récemment :
   ```bash
   pnpm --filter application-material gen:sdk
   ```
3. **Identifier les hooks disponibles** dans `src/sdk/generated/<domain>/`
4. **Connaître les path aliases** :
   - `@Sdk` → `src/sdk/generated`
   - `@Common` → `src/Common`
   - `@Feature` → `src/<Feature>` (à configurer dans `vite.config.ts` si nouveau module)

---

## Étape 1 — `domain/` — types métier

```
src/Feature/domain/
└── Feature.ts
```

```ts
// src/Feature/domain/Feature.ts
// Re-exporter les types SDK + Zod schemas + ajouter les types dérivés propres au domaine
export type { FeatureType, CreateFeatureBody, UpdateFeatureBody } from '@Sdk/model'
export type { CreateFeatureMutationBody, UpdateFeatureMutationBody } from '@Sdk/feature/feature'
export { CreateFeatureBody, UpdateFeatureBody } from '@Sdk/feature/feature.zod'

// Types dérivés (enrichis, transformés)
export type FeatureId = { featureId: string }
export type FeatureWithDetails = FeatureType & {
  // champs calculés ou relations chargées
}
```

**Règles** :
- Aucun import de hooks ou de logique — types purs uniquement
- Les Zod schemas (`*.zod`) **doivent** être exportés ici — jamais importés directement depuis `@Sdk` dans `ui/`
- C'est le seul endroit où `@Sdk` est autorisé en dehors de `infrastructure/`

---

## Étape 2 — `infrastructure/` — alias SDK

```
src/Feature/infrastructure/
└── useFeatureApi.ts
```

```ts
// src/Feature/infrastructure/useFeatureApi.ts
// Alias stables qui isolent l'UI des regénérations SDK
// Si orval renomme un hook, seul ce fichier change.
export {
  useGetFeatures,
  useGetFeature,
  useCreateFeature,
  useUpdateFeature,
  useRemoveFeature,
  getGetFeaturesQueryKey,
  getGetFeatureQueryKey,
} from '@Sdk/feature/feature'
```

**Règle** : aucune logique ici — uniquement des re-exports depuis `@Sdk`.

---

## Étape 3 — `application/` — hooks métier

Un hook par use-case. Chaque hook orchestre pagination, filtres, mutations, et invalidation de cache.

```
src/Feature/application/
├── useFeatureList.ts
├── useFeatureList.test.ts
├── useFeatureDetail.ts
├── useFeatureBreadcrumb.ts
├── useFeatureForm.ts
└── useFeatureForm.test.ts
```

### Hook de liste avec pagination

```ts
// src/Feature/application/useFeatureList.ts
import { usePagination } from '@Common/hooks/usePagination'
import { useGetFeatures, useCountFeatures } from '../infrastructure/useFeatureApi'

export const useFeatureList = () => {
  const { page, rowsPerPage, ...pagination } = usePagination()
  const query = useGetFeatures({ page, limit: rowsPerPage })
  const countQuery = useCountFeatures()
  const totalPages = Math.ceil((countQuery.data?.count ?? 0) / rowsPerPage)
  return { query, pagination: { page, rowsPerPage, ...pagination }, totalPages, changePage: pagination.setPage }
}
```

### Hook de détail

```ts
// src/Feature/application/useFeatureDetail.ts
import { useGetFeature } from '../infrastructure/useFeatureApi'

export const useFeatureDetail = (featureId: string) =>
  useGetFeature(featureId, { query: { enabled: !!featureId, retry: 0 } })
```

### Hook de breadcrumb

Toujours créer un hook dédié plutôt que d'appeler l'infrastructure depuis le composant :

```ts
// src/Feature/application/useFeatureBreadcrumb.ts
import { useGetFeature } from '../infrastructure/useFeatureApi'

export const useFeatureBreadcrumb = (featureId: string) =>
  useGetFeature(featureId, { query: { enabled: !!featureId } })
```

### Hook de formulaire (create + update)

```ts
// src/Feature/application/useFeatureForm.ts
import {
  useCreateFeature,
  useUpdateFeature,
  getGetFeaturesQueryKey,
} from '../infrastructure/useFeatureApi'
import type { CreateFeatureMutationBody, UpdateFeatureMutationBody } from '../domain/Feature'

export const useFeatureForm = () => {
  const create = useCreateFeature({ mutation: { meta: { invalidates: [getGetFeaturesQueryKey()] } } })
  const update = useUpdateFeature({ mutation: { meta: { invalidates: [getGetFeaturesQueryKey()] } } })

  return {
    submit: (data: CreateFeatureMutationBody | UpdateFeatureMutationBody, id?: string) =>
      id
        ? update.mutateAsync({ id, data: data as UpdateFeatureMutationBody })
        : create.mutateAsync({ data: data as CreateFeatureMutationBody }),
    isPending: create.isPending || update.isPending,
    isSuccess: create.isSuccess || update.isSuccess,
  }
}
```

**Règle** : les hooks application importent depuis `../infrastructure/`, jamais directement depuis `@Sdk`.

---

## Étape 4 — `ui/` — composants purs

Chaque composant dans son propre dossier co-localisé avec son test :

```
src/Feature/ui/
├── FeatureCard/
│   ├── FeatureCard.tsx
│   └── FeatureCard.test.tsx
├── FeatureCardGrid/
│   ├── FeatureCardGrid.tsx
│   └── FeatureCardGrid.test.tsx
├── FeatureCardList/
│   ├── FeatureCardList.tsx
│   └── FeatureCardList.test.tsx
├── FeatureBreadcrumb/
│   ├── FeatureBreadcrumb.tsx
│   └── FeatureBreadcrumb.test.tsx
├── FeatureForm/
│   ├── FeatureForm.tsx
│   └── FeatureForm.test.tsx
└── FeatureList/
    ├── FeatureList.tsx
    └── FeatureList.test.tsx
```

### Composant carte (présentation pure)

```tsx
// src/Feature/ui/FeatureCard/FeatureCard.tsx
import type { FeatureType } from '../../domain/Feature'
import { Card } from '@repo/design-system'

type Props = { feature: FeatureType }

export const FeatureCard = ({ feature }: Props) => (
  <Card.Container>
    <Card.Title>{feature.name}</Card.Title>
  </Card.Container>
)
```

### Vue grille avec virtualisation (Grid.Root)

```tsx
// src/Feature/ui/FeatureCardGrid/FeatureCardGrid.tsx
import { Grid, Card } from '@repo/design-system'
import type { FeatureType } from '../../domain/Feature'

type Props = { features: FeatureType[] }

export const FeatureCardGrid = ({ features }: Props) => (
  <Grid.Root
    aria-label="Features"
    items={features}
    variant="ghost"
    className="h-full"
    layoutOptions={{ minItemSize: { width: 200, height: 220 } }}
  >
    {feature => (
      <Grid.Item id={feature.id} textValue={feature.name}>
        <Card.Container className="h-full items-center text-center">
          <Card.Title>{feature.name}</Card.Title>
        </Card.Container>
      </Grid.Item>
    )}
  </Grid.Root>
)
```

> `h-full` est **obligatoire** sur `Grid.Root` — sans hauteur explicite le Virtualizer ne rend rien.
> `minItemSize` contrôle la taille minimale des cellules ; les colonnes sont auto-calculées.

### Vue liste avec virtualisation (List.Root)

```tsx
// src/Feature/ui/FeatureCardList/FeatureCardList.tsx
import { List, Card } from '@repo/design-system'
import type { FeatureType } from '../../domain/Feature'

type Props = { features: FeatureType[] }

export const FeatureCardList = ({ features }: Props) => (
  <List.Root
    aria-label="Features"
    items={features}
    variant="ghost"
    className="h-full"
    layoutOptions={{ rowHeight: 84 }}
  >
    {feature => (
      <List.Item id={feature.id} textValue={feature.name}>
        <Card.Container className="w-full flex-row items-center">
          <Card.Title>{feature.name}</Card.Title>
        </Card.Container>
      </List.Item>
    )}
  </List.Root>
)
```

### Breadcrumb (appelle un hook application)

```tsx
// src/Feature/ui/FeatureBreadcrumb/FeatureBreadcrumb.tsx
import { useFeatureBreadcrumb } from '../../application/useFeatureBreadcrumb'

export const FeatureBreadcrumb = ({ featureId }: { featureId: string }) => {
  const { data: feature } = useFeatureBreadcrumb(featureId)
  return <>{feature?.name ?? featureId}</>
}
```

### Formulaire avec Zod (schemas depuis domain, jamais @Sdk)

```tsx
// src/Feature/ui/FeatureForm/FeatureForm.tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateFeatureBody, UpdateFeatureBody } from '../../domain/Feature' // ← domain, PAS @Sdk
import { useFeatureForm } from '../../application/useFeatureForm'
```

### Conteneur liste (orchestre application + UI)

```tsx
// src/Feature/ui/FeatureList/FeatureList.tsx
import { Suspense, use } from 'react'
import { useFeatureList } from '../../application/useFeatureList'
import { FeatureCardGrid } from '../FeatureCardGrid/FeatureCardGrid'
import { FeatureCardList } from '../FeatureCardList/FeatureCardList'
import { Layout, Separator } from '@repo/design-system'

type ViewMode = 'grid' | 'list'
type Props = { viewMode: ViewMode }

export const FeatureList = ({ viewMode }: Props) => {
  const { query, pagination, changePage, totalPages } = useFeatureList()
  const features = use(query.promise) // TanStack Query v5 + React 19

  return (
    <Layout.Root>
      <Layout.Content className="p-2">
        <Suspense>
          {viewMode === 'grid' && <FeatureCardGrid features={features} />}
          {viewMode === 'list' && <FeatureCardList features={features} />}
        </Suspense>
      </Layout.Content>
      <Layout.Footer className="py-1">
        <Separator orientation="horizontal" />
        {/* FeatureListPagination */}
      </Layout.Footer>
    </Layout.Root>
  )
}
```

**Règles** :
- **Jamais** d'import depuis `@Sdk` dans `ui/` — ni types, ni hooks, ni Zod schemas
- Les Zod schemas viennent de `../../domain/Feature`, pas de `@Sdk/feature/feature.zod`
- `useNavigate` est toléré pour le routing
- Les composants purs (card, list, grid) reçoivent des données via props — pas de hooks réseau

---

## Étape 5 — `pages/` — orchestration

```
src/Feature/pages/
├── FeaturePage.tsx
├── FeatureCreatePage.tsx
├── FeatureEditPage.tsx
└── index.ts
```

```tsx
// src/Feature/pages/FeaturePage.tsx
import { Suspense } from 'react'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { useLocalStorage } from '@Common/hooks/useLocalStorage'
import { FeatureList } from '../ui/FeatureList/FeatureList'
import { Layout } from '@repo/design-system'

type ViewMode = 'grid' | 'list'

export const FeaturePage = () => {
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('feature-view-mode', 'grid')
  return (
    <Layout.Root>
      <Layout.Content>
        <ErrorBoundary>
          <Suspense>
            <FeatureList viewMode={viewMode} />
          </Suspense>
        </ErrorBoundary>
      </Layout.Content>
    </Layout.Root>
  )
}
```

```tsx
// src/Feature/pages/FeatureCreatePage.tsx — Dialog via Outlet
import { useNavigate } from 'react-router'
import { Dialog } from '@repo/design-system'
import { FeatureForm } from '../ui/FeatureForm/FeatureForm'

export const FeatureCreatePage = () => {
  const navigate = useNavigate()
  return (
    <Dialog open onOpenChange={() => navigate('..')}>
      <FeatureForm onFinish={() => navigate('..')} />
    </Dialog>
  )
}
```

---

## Étape 6 — Tests unitaires (co-localisés)

**Application hooks** — avec `renderHook` :
```ts
import { renderHookWithProviders } from '@Common/testUtils'
import { useFeatureForm } from './useFeatureForm'

describe('useFeatureForm', () => {
  it('submit calls create when no id provided', async () => {
    const { result } = renderHookWithProviders(() => useFeatureForm())
    result.current.submit({ name: 'Test' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
```

**Composants UI** — avec RTL (sans providers réseau — signe de pureté) :
```tsx
import { render } from '@testing-library/react'
import { FeatureCard } from './FeatureCard'

describe('FeatureCard', () => {
  it('renders the feature name', () => {
    const { getByText } = render(<FeatureCard feature={{ id: '1', name: 'Mon Feature' }} />)
    expect(getByText('Mon Feature')).toBeInTheDocument()
  })
})
```

---

## Étape 7 — Routing

Ajouter dans `src/Application/AppRouting.tsx` :

```tsx
import { FeatureBreadcrumb } from '@Feature/ui/FeatureBreadcrumb/FeatureBreadcrumb'
import { FeaturePage, FeatureCreatePage, FeatureEditPage } from '@Feature/pages'

<Route path="features" handle={{ breadcrumb: 'Features' }}>
  <Route index element={<FeaturePage />}>
    <Route path="create" element={<FeatureCreatePage />} />
    <Route path=":featureId/edit" element={<FeatureEditPage />} />
  </Route>
  <Route
    path=":featureId"
    handle={{ breadcrumb: ({ params }) => <FeatureBreadcrumb featureId={params.featureId!} /> }}
  />
</Route>
```

Ajouter l'alias dans `vite.config.ts` si le module est nouveau :
```ts
{ find: '@Feature', replacement: resolve(__dirname, 'src/Feature') }
```

---

## Étape 8 — Barrel export

```ts
// src/Feature/index.ts
export * from './domain/Feature'
export * from './application/useFeatureList'
export * from './application/useFeatureDetail'
export * from './application/useFeatureBreadcrumb'
export * from './application/useFeatureForm'
export * from './ui/FeatureCard/FeatureCard'
export * from './ui/FeatureBreadcrumb/FeatureBreadcrumb'
export * from './ui/FeatureList/FeatureList'
export * from './ui/FeatureForm/FeatureForm'
export * from './pages'
```

---

## Étape 9 — Audit architectural (checklist avant commit)

Avant de committer, vérifier chaque point :

| Règle | Vérification |
|---|---|
| `ui/` n'importe jamais `@Sdk` | `grep -r "@Sdk" src/Feature/ui/` → zéro résultat |
| Zod schemas dans `domain/`, pas dans `ui/` | `grep -r "\.zod" src/Feature/ui/` → zéro résultat |
| `application/` n'importe jamais `@Sdk` | `grep -r "@Sdk" src/Feature/application/` → zéro résultat |
| `ui/` appelle uniquement `application/` (jamais `infrastructure/`) | `grep -r "infrastructure" src/Feature/ui/` → zéro résultat |
| Breadcrumb a son hook `application/` | `useFeatureBreadcrumb.ts` existe |
| Chaque composant `ui/` dans son propre dossier | `src/Feature/ui/FeatureCard/FeatureCard.tsx` etc. |
| `Grid.Root` / `List.Root` ont `h-full` dans le contexte `Layout.Content` | Vérifier className |
| Tests UI sans QueryClientProvider | `grep -r "QueryClient" src/Feature/ui/` → zéro résultat |

---

## Étape 10 — Vérification finale

```bash
pnpm --filter application-material check:types   # Zéro erreur TypeScript
pnpm --filter application-material test          # Tests co-localisés passent
```

Vérifier manuellement :
- Navigation vers la page liste fonctionne
- Vue grille et vue liste switchent correctement
- Modal create/edit s'ouvre via Outlet
- Invalidation du cache après mutation (liste se rafraîchit)
- Breadcrumb affiche le bon nom
