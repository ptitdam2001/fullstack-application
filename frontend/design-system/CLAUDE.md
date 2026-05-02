# Design System — @repo/design-system

React Aria Components + Tailwind CSS v4. Composants accessibles, composables, documentés par Storybook.

## Stack

| Outil                                 | Rôle                                           |
| ------------------------------------- | ---------------------------------------------- |
| `react-aria-components@1.16`          | Primitives accessibles (state, keyboard, ARIA) |
| `tailwindcss@4` + `@tailwindcss/vite` | Styles utilitaires                             |
| `class-variance-authority`            | Variants typés (`cva()`)                       |
| `cn()` (`clsx` + `tailwind-merge`)    | Fusion sécurisée de classes                    |
| `Slot` (`src/utils/Slot.tsx`)         | Pattern `asChild` polymorphe                   |
| Storybook 10                          | Documentation + tests d'interaction            |
| Vitest + RTL                          | Tests unitaires                                |

## Anatomie d'un composant

### Simple — wrapper HTML + CVA

Utilisé pour : Button, Input, Label, Badge, Separator.

```text
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

| Pattern UI     | Primitif react-aria                                              |
| -------------- | ---------------------------------------------------------------- |
| Dialog / Modal | `DialogTrigger` + `Dialog` + `Modal` + `ModalOverlay`            |
| Menu déroulant | `MenuTrigger` + `Menu` + `Popover` + `MenuItem`                  |
| Select         | `Select` + `SelectValue` + `Popover` + `ListBox` + `ListBoxItem` |
| Combobox       | `ComboBox` + `Input` + `Popover` + `ListBox`                     |
| Tooltip        | `TooltipTrigger` + `Tooltip`                                     |
| Tabs           | `Tabs` + `TabList` + `Tab` + `TabPanel`                          |

```text
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
import { fn, within, userEvent, expect } from 'storybook/test'
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

## Système de thèmes

### Architecture

```text
src/theme/
├── types.ts                          # ThemeConfig, ThemeTokens, IThemeStorage
├── defaultTheme.ts                   # Thème "default" (tokens vides)
├── tokenMap.ts                       # Mapping camelCase → nom CSS var
├── applyTheme.ts                     # Injecte <style id="ds-theme-override"> dans document.head
└── storage/
    └── LocalStorageThemeStorage.ts   # Implémentation localStorage (clé: "ds-theme-config")

src/providers/ThemeProvider/
└── ThemeProvider.tsx                 # next-themes + ThemeConfigContext

src/hooks/
└── use-theme-config.ts               # useThemeConfig — hook principal
```

### Concepts clés

**Deux couches indépendantes :**

1. **Mode couleur** (`light` / `dark` / `system`) — géré par `next-themes`. Applique la classe `.dark` sur `document.documentElement`. Persisté par next-themes dans `localStorage` sous la clé `theme`.
2. **Tokens personnalisés** — overrides CSS injestés via `<style id="ds-theme-override">`. Persistés par `IThemeStorage` (défaut : `LocalStorageThemeStorage` sous la clé `ds-theme-config`).

**`ThemeConfig` :**

```typescript
type ThemeConfig = {
  name: string
  tokens: {
    light: Partial<ThemeTokens> // overrides pour le mode clair
    dark: Partial<ThemeTokens> // overrides pour le mode sombre
  }
}
```

Tokens vides = CSS variables de `src/styles/index.css` s'appliquent sans modification.

### Usage

**Wrapper racine de l'application :**

```tsx
import { ThemeProvider } from '@repo/design-system'
;<ThemeProvider defaultMode="system">
  <App />
</ThemeProvider>
```

**Toggle dark/light :**

```tsx
import { ThemeToggle } from '@repo/design-system'
;<ThemeToggle /> // cycle light → dark → system
```

**Hook complet :**

```tsx
import { useThemeConfig } from '@repo/design-system'

const {
  colorMode, // 'light' | 'dark' | 'system' | undefined
  setColorMode, // (mode: string) => void
  themeConfig, // ThemeConfig courant
  updateTokens, // (tokens: Partial<ThemeTokens>, mode?: 'light' | 'dark') => void
  resetTheme, // () => void — retour au thème default
  setThemeConfig, // (config: ThemeConfig) => void — remplacement complet
} = useThemeConfig()

// Exemple : changer la couleur primaire
updateTokens({ primary: 'oklch(0.6 0.2 200)' }, 'light')
updateTokens({ primary: 'oklch(0.8 0.2 200)' }, 'dark')
```

### Swap localStorage → API

Implémenter l'interface `IThemeStorage` et la fournir à `ThemeProvider` :

```typescript
import type { IThemeStorage, ThemeConfig } from '@repo/design-system'

class ApiThemeStorage implements IThemeStorage {
  async load(): ThemeConfig | null { /* GET /api/theme */ }
  async save(config: ThemeConfig): void { /* PUT /api/theme */ }
  async clear(): void { /* DELETE /api/theme */ }
}

<ThemeProvider storage={new ApiThemeStorage()}>
  <App />
</ThemeProvider>
```

> Note : quand l'API est synchrone (return de Promise), les méthodes de `IThemeStorage` peuvent être async — `ThemeProvider` appelle `load()` dans `useState` init donc la version API nécessitera un chargement asynchrone séparé (useEffect + état loading). Prévoir cet ajustement au moment du swap.

### Tokens disponibles

Voir `src/theme/types.ts` pour la liste complète (`ThemeTokens`). Principaux :

| Token camelCase | CSS var         | Usage                          |
| --------------- | --------------- | ------------------------------ |
| `primary`       | `--primary`     | Couleur d'action principale    |
| `secondary`     | `--secondary`   | Couleur secondaire             |
| `accent`        | `--accent`      | Mise en avant subtile          |
| `background`    | `--background`  | Fond de page                   |
| `foreground`    | `--foreground`  | Texte principal                |
| `destructive`   | `--destructive` | Danger / suppression           |
| `radius`        | `--radius`      | Arrondi de base (ex: `0.5rem`) |
| `sidebar`       | `--sidebar`     | Fond du sidebar                |

### Ajouter un thème prédéfini

```typescript
import type { ThemeConfig } from '@repo/design-system'

export const BLUE_THEME: ThemeConfig = {
  name: 'blue',
  tokens: {
    light: {
      primary: 'oklch(0.546 0.245 262.881)',
      primaryForeground: 'oklch(0.985 0 0)',
      ring: 'oklch(0.546 0.245 262.881)',
    },
    dark: {
      primary: 'oklch(0.707 0.165 254.624)',
      primaryForeground: 'oklch(0.205 0 0)',
    },
  },
}

// Appliquer :
const { setThemeConfig } = useThemeConfig()
setThemeConfig(BLUE_THEME)
```

## Commandes

```bash
pnpm --filter @repo/design-system build      # Build → dist/
pnpm --filter @repo/design-system test       # Vitest
pnpm --filter @repo/design-system storybook  # Storybook :6006
```

> Rebuild requis avant chaque utilisation dans `application-material` si CSS ou exports changent.
