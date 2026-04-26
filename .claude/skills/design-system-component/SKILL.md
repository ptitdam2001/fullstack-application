---
name: design-system-component
description: Scaffolds or modifies a component in @repo/design-system (react-aria-components + Tailwind CSS v4 + Storybook). Use this skill whenever the user wants to create, add, or update a component in the design system: "créer un composant", "ajouter un composant au design system", "nouveau composant", "create component", "add to design system", "composant Select/Combobox/Badge/...". Always invoke this skill before writing any design system component code.
---

# Design System Component

Composants accessibles basés sur react-aria-components + Tailwind CSS v4.
Projet : `/Users/suhard/Documents/Development/fullstack-application/frontend/design-system/`
Référence locale : `frontend/design-system/CLAUDE.md`

---

## Étape 1 — Identifier le type de composant

Demander ou déduire : **quel composant créer ?**

Classer en trois catégories :

| Type | Exemples | Stratégie |
|---|---|---|
| **Simple** | Button, Input, Badge, Label, Separator | HTML natif + CVA + `data-slot` |
| **Composé** | Dialog, DropdownMenu, Select, Combobox, Tooltip, Tabs | Primitifs react-aria-components |
| **Complexe** | Sidebar, Calendar | Context + Provider + ~N sous-composants |

Pour un composant **composé**, identifier le primitif react-aria à utiliser :

| Pattern UI | Primitifs react-aria-components |
|---|---|
| Modal / Dialog | `DialogTrigger` + `Dialog` + `Modal` + `ModalOverlay` |
| Menu déroulant | `MenuTrigger` + `Menu` + `Popover` + `MenuItem` |
| Select | `Select` + `SelectValue` + `Popover` + `ListBox` + `ListBoxItem` |
| Combobox | `ComboBox` + `Input` + `Popover` + `ListBox` + `ListBoxItem` |
| Tooltip | `TooltipTrigger` + `Tooltip` |
| Tabs | `Tabs` + `TabList` + `Tab` + `TabPanel` |
| Popover standalone | `DialogTrigger` + `Dialog` + `Popover` |
| Checkbox | `Checkbox` |
| Radio | `RadioGroup` + `Radio` |
| Switch | `Switch` |
| Slider | `Slider` + `SliderTrack` + `SliderThumb` |

Consulter la doc react-aria-components pour le primitif ciblé avant d'implémenter.

---

## Étape 2 — Créer la structure de fichiers

Dossier : `src/components/NomComposant/`

**Composant simple** :
```
src/components/NomComposant/
├── NomComposant.tsx          # Wrapper HTML
├── NomComposant.test.tsx     # Tests co-localisés
├── NomComposantVariants.ts   # cva() — uniquement si variants multiples
└── NomComposant.stories.tsx
```

**Composant composé** :
```
src/components/NomComposant/
├── NomComposant.tsx          # Root (wraps AriaTrigger)
├── NomComposantContent.tsx   # Contenu (wraps AriaXxx + Popover/Modal)
├── NomComposantItem.tsx      # Item si applicable
├── [autres sous-composants]
├── NomComposant.test.tsx
└── NomComposant.stories.tsx
```

---

## Étape 3 — Implémenter le composant

### Conventions obligatoires

1. **`data-slot="nom-composant"`** sur chaque élément root — exemple : `data-slot="select"`, `data-slot="select-content"`
2. **`cn()`** pour toutes les fusions de classes (jamais de concaténation string)
3. **`cva()`** si plusieurs axes de variation (variant + size)
4. Renommer les imports react-aria pour éviter les conflits :
   ```tsx
   import { Select as AriaSelect, SelectValue as AriaSelectValue } from 'react-aria-components'
   ```

### Composant simple (exemple : Badge)
```tsx
import { cn } from '../../utils/cn'
import { BadgeVariants } from './BadgeVariants'
import type { VariantProps } from 'class-variance-authority'

type BadgeProps = React.ComponentProps<'span'> & VariantProps<typeof BadgeVariants>

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span
    data-slot="badge"
    className={cn(BadgeVariants({ variant }), className)}
    {...props}
  />
)
```

```ts
// BadgeVariants.ts
import { cva } from 'class-variance-authority'

export const BadgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground border-transparent',
        secondary: 'bg-secondary text-secondary-foreground border-transparent',
        destructive: 'bg-destructive text-destructive-foreground border-transparent',
        outline: 'text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)
```

### Pattern asChild (composants polymorphes)
```tsx
import { Slot } from '../../utils/Slot'

type Props = React.ComponentProps<'button'> & { asChild?: boolean }

export const NomComposant = ({ asChild, className, ...props }: Props) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp data-slot="nom" className={cn('...', className)} {...props} />
}
```

---

## Étape 4 — Storybook stories

```tsx
// NomComposant.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { within, userEvent, expect } from '@storybook/test'
import { NomComposant } from './NomComposant'

const meta = {
  component: NomComposant,
  args: { onChange: fn() },
} satisfies Meta<typeof NomComposant>

export default meta
type Story = StoryObj<typeof meta>

// Story par défaut
export const Default: Story = {
  args: { /* props minimaux */ },
}

// Une story par variant significatif
export const Destructive: Story = {
  args: { variant: 'destructive' },
}

// Play function pour les composants interactifs
export const Interaction: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await expect(args.onChange).toHaveBeenCalledOnce()
  },
}
```

**Règles stories** :
- `play` function obligatoire pour tout composant avec état ou événement (click, focus, keyboard)
- Tester la navigation clavier pour les composants react-aria (Tab, ArrowDown, Enter, Escape)
- `fn()` pour mocker les callbacks dans `args`

---

## Étape 5 — Tests unitaires (co-localisés)

Fichier : `src/components/NomComposant/NomComposant.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { NomComposant } from './NomComposant'

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

  // Tester chaque variant CVA
  it('applies destructive variant', () => {
    const { container } = render(<NomComposant variant="destructive" />)
    expect(container.firstChild).toHaveClass('bg-destructive')
  })
})
```

**Ce qu'il faut tester** :
- `data-slot` présent avec la bonne valeur
- `className` forwarding (classes custom appliquées)
- Rendu des enfants
- Chaque variant CVA applique les bonnes classes
- Attributs ARIA (`aria-invalid`, `aria-disabled`, `role`, etc.)

---

## Étape 6 — Exporter depuis src/index.ts

```ts
// src/index.ts — ajouter à la fin de la section appropriée
export * from './components/NomComposant/NomComposant'
// Si sous-composants séparés :
export * from './components/NomComposant/NomComposantContent'
export * from './components/NomComposant/NomComposantItem'
// Si variants exportés :
export * from './components/NomComposant/NomComposantVariants'
```

---

## Étape 7 — Vérification

```bash
# Depuis frontend/
pnpm --filter @repo/design-system build   # Doit compiler sans erreur
pnpm --filter @repo/design-system test    # Tests co-localisés doivent passer
```

> Si `application-material` utilise ce composant, rebuild obligatoire avant de lancer le dev server.
