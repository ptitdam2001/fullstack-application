# Design System — @repo/design-system

React Aria Components + Tailwind CSS v4. Composants accessibles, composables, documentés par Storybook.

## Stack

| Outil | Rôle |
|---|---|
| `react-aria-components@1.16` | Primitives accessibles (state, keyboard, ARIA) |
| `tailwindcss@4` + `@tailwindcss/vite` | Styles utilitaires |
| `class-variance-authority` | Variants typés (`cva()`) |
| `cn()` (`clsx` + `tailwind-merge`) | Fusion sécurisée de classes |
| `Slot` (`src/utils/Slot.tsx`) | Pattern `asChild` polymorphe |
| Storybook 10 | Documentation + tests d'interaction |
| Vitest + RTL | Tests unitaires |

## Anatomie d'un composant

### Simple — wrapper HTML + CVA
Utilisé pour : Button, Input, Label, Badge, Separator.

```
src/components/NomComposant/
├── NomComposant.tsx          # Wrapper HTML avec data-slot + cn()
├── NomComposant.test.tsx     # Tests unitaires co-localisés
├── NomComposantVariants.ts   # cva() si variantes multiples
└── NomComposant.stories.tsx
```

```tsx
// NomComposant.tsx
export const NomComposant = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div data-slot="nom-composant" className={cn('...classes de base...', className)} {...props} />
)
```

### Composé — primitives react-aria-components
Utilisé pour : Dialog, DropdownMenu, Popover, Tooltip, Select, Combobox, Tabs.

Chaque sous-composant est un fichier séparé. Le primitif react-aria gère l'état et l'accessibilité.

| Pattern UI | Primitif react-aria |
|---|---|
| Dialog / Modal | `DialogTrigger` + `Dialog` + `Modal` + `ModalOverlay` |
| Menu déroulant | `MenuTrigger` + `Menu` + `Popover` + `MenuItem` |
| Select | `Select` + `SelectValue` + `Popover` + `ListBox` + `ListBoxItem` |
| Combobox | `ComboBox` + `Input` + `Popover` + `ListBox` |
| Tooltip | `TooltipTrigger` + `Tooltip` |
| Tabs | `Tabs` + `TabList` + `Tab` + `TabPanel` |

```
src/components/NomComposant/
├── NomComposant.tsx          # Root (wraps AriaXxxTrigger)
├── NomComposantContent.tsx   # Contenu (wraps AriaXxx + Popover/Modal)
├── NomComposantItem.tsx      # Item (wraps AriaXxxItem)
├── NomComposant.test.tsx
└── NomComposant.stories.tsx
```

### Complexe — Context + Provider + sous-composants
Utilisé pour : Sidebar, Calendar. État global via React Context.

## Conventions

- **`data-slot="nom-composant"`** obligatoire sur chaque élément root (utilisé pour styling contextuel et tests)
- **`cn()`** pour toutes les fusions de classes — jamais de concaténation directe
- **`cva()`** dès qu'il y a plusieurs variants (>1 axe de variation)
- **`asChild`** via `Slot` quand le composant doit être polymorphe :
  ```tsx
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(variants({ variant, size }), className)} {...props} />
  ```
- Importer react-aria en renommant pour éviter les conflits :
  ```tsx
  import { Dialog as AriaDialog, Modal, ModalOverlay } from 'react-aria-components'
  ```

## Storybook

```tsx
// NomComposant.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { within, userEvent, expect } from '@storybook/test'
import { NomComposant } from './NomComposant'

const meta = {
  component: NomComposant,
  args: { onClick: fn() },
} satisfies Meta<typeof NomComposant>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Label' },
}

export const AvecInteraction: Story = {
  args: { children: 'Cliquer' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    expect(args.onClick).toHaveBeenCalledOnce()
  },
}
```

- Une story par variant significatif
- `play` function obligatoire pour les composants interactifs (click, focus, keyboard nav)

## Tests unitaires

Co-localisés avec le composant (`NomComposant.test.tsx` dans le même dossier).
Setup global dans `tests/setup.ts` (déjà configuré).

```tsx
// NomComposant.test.tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

describe('NomComposant', () => {
  it('sets data-slot', () => {
    const { container } = render(<NomComposant />)
    expect(container.firstChild).toHaveAttribute('data-slot', 'nom-composant')
  })

  it('forwards className', () => {
    const { container } = render(<NomComposant className="custom" />)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders children', () => {
    const { getByText } = render(<NomComposant>Contenu</NomComposant>)
    expect(getByText('Contenu')).toBeInTheDocument()
  })
})
```

Tester : présence du `data-slot`, forwarding de `className`, rendu des enfants, chaque variant CVA.

## Export

Ajouter dans `src/index.ts` après création :
```ts
export * from './components/NomComposant/NomComposant'
// Si variants exportés :
export * from './components/NomComposant/NomComposantVariants'
```

## Commandes

```bash
pnpm --filter @repo/design-system build      # Build → dist/
pnpm --filter @repo/design-system test       # Vitest
pnpm --filter @repo/design-system storybook  # Storybook :6006
```

> Rebuild requis avant chaque utilisation dans `application-material` si CSS ou exports changent.
