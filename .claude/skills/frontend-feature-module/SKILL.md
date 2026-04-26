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
// Re-exporter les types SDK + ajouter les types dérivés propres au domaine
export type { FeatureType, CreateFeatureBody, UpdateFeatureBody } from '@Sdk'

// Types dérivés (enrichis, transformés)
export type FeatureWithDetails = FeatureType & {
  // champs calculés ou relations chargées
}
```

**Règle** : aucun import de hooks ou de logique ici — types purs uniquement.

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
} from '@Sdk'
```

**Règle** : aucune logique ici — uniquement des re-exports.

---

## Étape 3 — `application/` — hooks métier

Un hook par use-case. Chaque hook orchestre pagination, filtres, mutations, et invalidation de cache.

```
src/Feature/application/
├── useFeatureList.ts
├── useFeatureList.test.ts
├── useFeatureDetail.ts
├── useFeatureForm.ts
└── useFeatureForm.test.ts
```

### Hook de liste avec pagination

```ts
// src/Feature/application/useFeatureList.ts
import { usePagination } from '@Common/hooks/usePagination'
import { useGetFeatures } from '../infrastructure/useFeatureApi'

export const useFeatureList = () => {
  const pagination = usePagination()
  const queryPromise = useGetFeatures({
    page: pagination.page,
    limit: pagination.rowsPerPage,
  })
  return { queryPromise, pagination }
}
```

### Hook de formulaire (create + update)

```ts
// src/Feature/application/useFeatureForm.ts
import {
  useCreateFeature,
  useUpdateFeature,
  getGetFeaturesQueryKey,
} from '../infrastructure/useFeatureApi'
import type { CreateFeatureBody, UpdateFeatureBody } from '../domain/Feature'

export const useFeatureForm = () => {
  const create = useCreateFeature({
    mutation: {
      meta: { invalidates: [getGetFeaturesQueryKey()] },
    },
  })
  const update = useUpdateFeature({
    mutation: {
      meta: { invalidates: [getGetFeaturesQueryKey()] },
    },
  })

  return {
    submit: (data: CreateFeatureBody | UpdateFeatureBody, id?: string) =>
      id
        ? update.mutateAsync({ id, data: data as UpdateFeatureBody })
        : create.mutateAsync({ data: data as CreateFeatureBody }),
    isPending: create.isPending || update.isPending,
    isSuccess: create.isSuccess || update.isSuccess,
  }
}
```

**Règle** : les hooks application importent depuis `../infrastructure/`, jamais directement depuis `@Sdk`.

---

## Étape 4 — `ui/` — composants purs

```
src/Feature/ui/
├── FeatureCard.tsx
├── FeatureCard.test.tsx
├── FeatureList.tsx
└── FeatureList.test.tsx
```

```tsx
// src/Feature/ui/FeatureCard.tsx
import type { FeatureType } from '../domain/Feature'
import { Card } from '@repo/design-system'

type Props = { feature: FeatureType }

export const FeatureCard = ({ feature }: Props) => (
  <Card.Container>
    <Card.Title>{feature.name}</Card.Title>
  </Card.Container>
)
```

**Règles** :
- Aucun import depuis `@Sdk` — les composants reçoivent tout via props
- Aucun appel de hook réseau
- Composants testables sans providers réseau

---

## Étape 5 — `pages/` — orchestration

```
src/Feature/pages/
├── FeaturePage.tsx         # Liste + Outlet pour modals
├── FeatureCreatePage.tsx   # Dialog/Sheet via Outlet
├── FeatureEditPage.tsx     # Dialog/Sheet via Outlet
└── index.ts
```

```tsx
// src/Feature/pages/FeaturePage.tsx
import { Outlet } from 'react-router'
import { Suspense } from 'react'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { useFeatureList } from '../application/useFeatureList'
import { FeatureList } from '../ui/FeatureList'

export const FeaturePage = () => {
  const { queryPromise, pagination } = useFeatureList()
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<div>Chargement...</div>}>
          <FeatureList queryPromise={queryPromise} pagination={pagination} />
        </Suspense>
      </ErrorBoundary>
      <Outlet />
    </>
  )
}
```

```tsx
// src/Feature/pages/FeatureCreatePage.tsx — Dialog via Outlet
import { Dialog, DialogContent } from '@repo/design-system'
import { useNavigate } from 'react-router'
import { FeatureForm } from '../ui/FeatureForm'

export const FeatureCreatePage = () => {
  const navigate = useNavigate()
  return (
    <Dialog open onOpenChange={() => navigate('..')}>
      <DialogContent>
        <FeatureForm />
      </DialogContent>
    </Dialog>
  )
}
```

---

## Étape 6 — Tests unitaires (co-localisés)

**Application hooks** — avec `renderHook` :
```ts
// src/Feature/application/useFeatureForm.test.ts
import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@Common/testUtils'   // wrapper QueryClient + MSW
import { useFeatureForm } from './useFeatureForm'

describe('useFeatureForm', () => {
  it('submit calls create when no id provided', async () => {
    const { result } = renderHook(() => useFeatureForm(), { wrapper: createWrapper() })
    result.current.submit({ name: 'Test' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
```

**Composants UI** — avec RTL :
```tsx
// src/Feature/ui/FeatureCard.test.tsx
import { render } from '@testing-library/react'
import { FeatureCard } from './FeatureCard'

describe('FeatureCard', () => {
  it('renders the feature name', () => {
    const { getByText } = render(<FeatureCard feature={{ id: '1', name: 'Mon Feature' }} />)
    expect(getByText('Mon Feature')).toBeInTheDocument()
  })
})
```

**Règle** : les tests UI ne doivent jamais avoir besoin d'un QueryClientProvider — signe que le composant est pur.

---

## Étape 7 — Routing

Ajouter dans `src/Application/AppRouting.tsx` :

```tsx
import { FeaturePage, FeatureCreatePage, FeatureEditPage } from '@Feature/pages'

// Dans le bloc <Route path="app">
<Route path="features" element={<FeatureLayout />} handle={{ breadcrumb: 'Features' }}>
  <Route index element={<FeaturePage />}>
    <Route path="create" element={<FeatureCreatePage />} />
    <Route path=":featureId/edit" element={<FeatureEditPage />} />
  </Route>
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
export * from './application/useFeatureForm'
export * from './ui/FeatureCard'
export * from './ui/FeatureList'
export * from './pages'
```

---

## Étape 9 — Vérification

```bash
pnpm --filter application-material check:types   # Zéro erreur TypeScript
pnpm --filter application-material test          # Tests co-localisés passent
```

Vérifier manuellement :
- Navigation vers la page liste fonctionne
- Modal create/edit s'ouvre via Outlet
- Invalidation du cache après mutation (liste se rafraîchit)
