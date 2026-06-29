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

## Étape 4 — `ui/` — boucle TDD par composant

### Mode TDD — ordre obligatoire pour chaque composant

Pour chaque composant `ui/`, respecter ce cycle :

```
1. RED    → écrire FeatureCard.test.tsx   (le composant n'existe pas encore → tests échouent)
2. GREEN  → écrire FeatureCard.tsx        (faire passer les tests)
3. STORY  → écrire FeatureCard.stories.tsx (valider le comportement interactif)
```

Ne pas écrire un composant sans avoir son test.  
Ne pas merger un composant interactif sans avoir ses stories avec play functions.

Chaque composant dans son propre dossier co-localisé :

```
src/Feature/ui/
├── FeatureCard/
│   ├── FeatureCard.test.tsx   ← RED d'abord
│   ├── FeatureCard.tsx        ← GREEN ensuite
│   └── FeatureCard.stories.tsx
├── FeatureCardGrid/
│   ├── FeatureCardGrid.test.tsx
│   ├── FeatureCardGrid.tsx
│   └── FeatureCardGrid.stories.tsx
├── FeatureCardList/
│   ├── FeatureCardList.test.tsx
│   ├── FeatureCardList.tsx
│   └── FeatureCardList.stories.tsx
├── FeatureBreadcrumb/
│   ├── FeatureBreadcrumb.test.tsx
│   └── FeatureBreadcrumb.tsx
├── FeatureForm/
│   ├── FeatureForm.test.tsx
│   ├── FeatureForm.tsx
│   └── FeatureForm.stories.tsx
└── FeatureList/
    ├── FeatureList.test.tsx
    ├── FeatureList.tsx
    └── FeatureList.stories.tsx
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

## Étape 6 — Tests unitaires (TDD — écrire avant le composant)

### Principe

Écrire le fichier `.test.tsx` **avant** le composant. Les tests doivent être en **rouge** quand on les écrit, puis **verts** une fois le composant implémenté.

### Contexte des tests

- `react-intl` est **globalement mocké** dans `tests/setup.ts` → `FormattedMessage` rend son `id` brut, `useIntl().formatMessage()` aussi.
- Asserter sur la **clé i18n**, pas la valeur traduite.
- Pas de `IntlProvider`, `QueryClientProvider`, ni `MemoryRouter` dans les tests composants purs — si le test en a besoin, c'est un signe que le composant n'est pas pur.

### Composants UI purs (props only)

```tsx
// FeatureCard.test.tsx — écrire AVANT FeatureCard.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { FeatureType } from '../../domain/Feature'
import { FeatureCard } from './FeatureCard'

const feature: FeatureType = { id: '1', name: 'Mon Feature', status: 'ACTIVE' }

describe('FeatureCard', () => {
  it('renders the name', () => {
    render(<FeatureCard feature={feature} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Mon Feature')).toBeInTheDocument()
  })

  it('renders the i18n key for status', () => {
    render(<FeatureCard feature={feature} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('feature.status.ACTIVE')).toBeInTheDocument()
  })

  it('calls onEdit with id when edit button is clicked', () => {
    const onEdit = vi.fn()
    render(<FeatureCard feature={feature} onEdit={onEdit} onDelete={vi.fn()} />)
    fireEvent.click(screen.getByLabelText('feature.action.edit'))
    expect(onEdit).toHaveBeenCalledWith('1')
  })

  it('calls onDelete with feature when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(<FeatureCard feature={feature} onEdit={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getByLabelText('feature.action.delete'))
    expect(onDelete).toHaveBeenCalledWith(feature)
  })
})
```

### Tableau (Table)

Couvrir : headers, rendu de chaque ligne, état vide, forwarding des callbacks.

```tsx
// FeatureTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { FeatureType } from '../../domain/Feature'
import { FeatureTable } from './FeatureTable'

const features: FeatureType[] = [
  { id: '1', name: 'Alpha', status: 'ACTIVE' },
  { id: '2', name: 'Beta', status: 'DRAFT' },
]

describe('FeatureTable', () => {
  it('renders table headers', () => {
    render(<FeatureTable features={features} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('feature.table.name')).toBeInTheDocument()
    expect(screen.getByText('feature.table.status')).toBeInTheDocument()
  })

  it('renders a row per feature', () => {
    render(<FeatureTable features={features} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(<FeatureTable features={[]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('feature.table.empty')).toBeInTheDocument()
  })

  it('forwards onEdit', () => {
    const onEdit = vi.fn()
    render(<FeatureTable features={features} onEdit={onEdit} onDelete={vi.fn()} />)
    fireEvent.click(screen.getAllByLabelText('feature.action.edit')[0])
    expect(onEdit).toHaveBeenCalledWith('1')
  })

  it('forwards onDelete', () => {
    const onDelete = vi.fn()
    render(<FeatureTable features={features} onEdit={vi.fn()} onDelete={onDelete} />)
    fireEvent.click(screen.getAllByLabelText('feature.action.delete')[1])
    expect(onDelete).toHaveBeenCalledWith(features[1])
  })
})
```

### Sheet (create/edit) avec mock des dépendances

```tsx
// FeatureFormSheet.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FeatureFormSheet } from './FeatureFormSheet'

// Mocker les dépendances à réseau
vi.mock('../../infrastructure/useFeatureApi', () => ({
  useGetFeature: vi.fn(),
}))
vi.mock('./FeatureForm', () => ({
  FeatureForm: ({ featureId }: { featureId?: string }) => (
    <div data-testid="feature-form" data-feature-id={featureId} />
  ),
}))
vi.mock('@Common/Loading/LinearProgress', () => ({
  LinearProgress: () => <div data-testid="linear-progress" />,
}))
vi.mock('@Common/NotFound', () => ({
  NotFound: () => <div data-testid="not-found" />,
}))

import { useGetFeature } from '../../infrastructure/useFeatureApi'
const mockedUseGetFeature = vi.mocked(useGetFeature)

describe('FeatureFormSheet', () => {
  describe('create mode', () => {
    it('renders create title', () => {
      render(<FeatureFormSheet open onOpenChange={vi.fn()} />)
      expect(screen.getByText('feature.dialog.create.title')).toBeInTheDocument()
    })
  })

  describe('edit mode', () => {
    const mockData = { id: '1', name: 'Alpha', status: 'ACTIVE' }

    it('renders form with featureId when loaded', () => {
      mockedUseGetFeature.mockReturnValue({ data: mockData, isLoading: false, isError: false } as never)
      render(<FeatureFormSheet open onOpenChange={vi.fn()} featureId="1" />)
      expect(screen.getByTestId('feature-form')).toHaveAttribute('data-feature-id', '1')
    })

    it('renders LinearProgress while loading', () => {
      mockedUseGetFeature.mockReturnValue({ data: undefined, isLoading: true, isError: false } as never)
      render(<FeatureFormSheet open onOpenChange={vi.fn()} featureId="1" />)
      expect(screen.getByTestId('linear-progress')).toBeInTheDocument()
    })

    it('renders NotFound on error', () => {
      mockedUseGetFeature.mockReturnValue({ data: undefined, isLoading: false, isError: true } as never)
      render(<FeatureFormSheet open onOpenChange={vi.fn()} featureId="1" />)
      expect(screen.getByTestId('not-found')).toBeInTheDocument()
    })
  })

  it('does not render content when closed', () => {
    render(<FeatureFormSheet open={false} onOpenChange={vi.fn()} />)
    expect(screen.queryByTestId('feature-form')).not.toBeInTheDocument()
  })
})
```

### Dialog de confirmation

```tsx
// ConfirmDeleteFeatureDialog.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDeleteFeatureDialog } from './ConfirmDeleteFeatureDialog'

describe('ConfirmDeleteFeatureDialog', () => {
  const defaultProps = { name: 'Alpha', open: true, onOpenChange: vi.fn(), onConfirm: vi.fn(), isPending: false }

  it('renders title and description', () => {
    render(<ConfirmDeleteFeatureDialog {...defaultProps} />)
    expect(screen.getByText('feature.delete.title')).toBeInTheDocument()
    expect(screen.getByText('feature.delete.description')).toBeInTheDocument()
  })

  it('calls onConfirm on confirm click', () => {
    const onConfirm = vi.fn()
    render(<ConfirmDeleteFeatureDialog {...defaultProps} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByText('feature.delete.confirm'))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('calls onOpenChange(false) on cancel click', () => {
    const onOpenChange = vi.fn()
    render(<ConfirmDeleteFeatureDialog {...defaultProps} onOpenChange={onOpenChange} />)
    fireEvent.click(screen.getByText('feature.delete.cancel'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('disables confirm when isPending', () => {
    render(<ConfirmDeleteFeatureDialog {...defaultProps} isPending />)
    expect(screen.getByText('feature.delete.confirm').closest('button')).toBeDisabled()
  })
})
```

### Application hooks

```ts
// useFeatureForm.test.ts
import { renderHookWithProviders } from '@Common/testUtils'
import { useFeatureForm } from './useFeatureForm'

describe('useFeatureForm', () => {
  it('exposes isPending false initially', () => {
    const { result } = renderHookWithProviders(() => useFeatureForm())
    expect(result.current.isPending).toBe(false)
  })
})
```

---

## Étape 7 — Stories Storybook (play functions + fn())

### Principe

Les stories valident le comportement **interactif** : keyboard, ouverture/fermeture, submit, callbacks.
Elles s'exécutent dans le navigateur (vrai DOM, vrai IntlProvider, vrai MSW) — complémentaires aux tests RTL.

### Contexte Storybook

- `IntlProvider` est actif → utiliser les **traductions réelles** (FR) dans les `play`, pas les clés i18n.
- MSW est actif → déclarer les handlers dans `parameters.msw.handlers`.
- Les callbacks testables passent par **`fn()` de `storybook/test`**.

### Formulaire (pattern principal)

```tsx
// FeatureForm.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect, waitFor } from 'storybook/test'
import { getCreateFeatureMockHandler, getUpdateFeatureMockHandler } from '@Sdk/feature/feature.msw'
import { FeatureForm } from './FeatureForm'

const meta = {
  component: FeatureForm,
  title: 'Feature/FeatureForm',
  args: {
    onFinish: fn(),   // ← spy sur le callback → assertable dans play
  },
  parameters: {
    msw: { handlers: [getCreateFeatureMockHandler(), getUpdateFeatureMockHandler()] },
  },
} satisfies Meta<typeof FeatureForm>

export default meta
type Story = StoryObj<typeof meta>

// ─── Create mode ──────────────────────────────────────────────────────────────

export const CreateButtonDisabled: Story = {
  name: 'Create — bouton désactivé initialement',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('button', { name: /nouvelle feature/i })).toBeDisabled()
  },
}

export const CreateSubmit: Story = {
  name: 'Create — soumettre appelle onFinish',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByRole('textbox', { name: /nom/i }), 'Alpha')
    // Si Select requis :
    await userEvent.click(canvas.getByRole('button', { name: /statut/i }))
    await userEvent.click(await canvas.findByRole('option', { name: /actif/i }))

    const submit = canvas.getByRole('button', { name: /créer/i })
    await waitFor(() => expect(submit).not.toBeDisabled())
    await userEvent.click(submit)

    await waitFor(() => expect(args.onFinish).toHaveBeenCalled())
  },
}

// ─── Edit mode ────────────────────────────────────────────────────────────────

const existing = { name: 'Alpha', status: 'ACTIVE' as const }

export const EditDisabledInitially: Story = {
  name: 'Edit — bouton désactivé si non modifié',
  args: { featureId: 'f-1', defaultValues: existing },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('button', { name: /mettre à jour/i })).toBeDisabled()
  },
}

export const EditSubmit: Story = {
  name: 'Edit — soumettre appelle onFinish',
  args: { featureId: 'f-1', defaultValues: existing },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const nameInput = canvas.getByRole('textbox', { name: /nom/i })

    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Alpha modifié')

    const submit = canvas.getByRole('button', { name: /mettre à jour/i })
    await waitFor(() => expect(submit).not.toBeDisabled())
    await userEvent.click(submit)

    await waitFor(() => expect(args.onFinish).toHaveBeenCalled())
  },
}
```

### Dialog de confirmation

```tsx
// ConfirmDeleteFeatureDialog.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import { ConfirmDeleteFeatureDialog } from './ConfirmDeleteFeatureDialog'

const meta = {
  component: ConfirmDeleteFeatureDialog,
  title: 'Feature/ConfirmDeleteFeatureDialog',
  args: {
    name: 'Alpha',
    open: true,
    isPending: false,
    onConfirm: fn(),     // ← spy
    onOpenChange: fn(),  // ← spy
  },
} satisfies Meta<typeof ConfirmDeleteFeatureDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'Dialogue de confirmation' }

export const ClickConfirm: Story = {
  name: 'Confirmer appelle onConfirm',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /supprimer/i }))
    expect(args.onConfirm).toHaveBeenCalled()
  },
}

export const ClickCancel: Story = {
  name: 'Annuler appelle onOpenChange(false)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /annuler/i }))
    expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}

export const Pending: Story = {
  name: 'Bouton désactivé pendant suppression',
  args: { isPending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('button', { name: /supprimer/i })).toBeDisabled()
  },
}
```

### Règles stories

| Règle | Raison |
|---|---|
| `fn()` sur tous les callbacks (onFinish, onConfirm, onOpenChange) | Assertable dans play, visible dans Storybook Actions |
| Textes de play en **traductions réelles** (FR) | IntlProvider actif — les clés i18n ne sont pas rendues |
| `await waitFor(...)` autour des assertions asynchrones | MSW a un délai → résultats pas immédiats |
| Un play par comportement observable | Clarté + isolation des échecs |
| Handlers MSW dans `parameters.msw.handlers` | Évite les vraies requêtes réseau |

---

## Étape 8 — Routing

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

## Étape 9 — Barrel export

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

## Étape 10 — Audit architectural (checklist avant commit)

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
| Chaque composant interactif a une story avec play | `grep -r "play:" src/Feature/ui/` → résultats pour chaque Form/Dialog |
| `fn()` sur tous les callbacks dans les stories | Callbacks assertables → visibles dans Storybook Actions |
| Stories passent en mode storybook Vitest | `pnpm vitest run --project storybook src/Feature` → zéro échec |

---

## Étape 11 — Vérification finale

```bash
pnpm --filter application-material check:types   # Zéro erreur TypeScript
pnpm --filter application-material test          # Unit tests passent
pnpm --filter application-material storybook     # Stories s'ouvrent, plays réussissent
```

Vérifier manuellement :
- Navigation vers la page liste fonctionne
- Vue grille et vue liste switchent correctement
- Modal create/edit s'ouvre via Outlet
- Invalidation du cache après mutation (liste se rafraîchit)
- Breadcrumb affiche le bon nom
- Stories avec play functions passent dans Storybook UI
