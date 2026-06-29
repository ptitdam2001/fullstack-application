---
name: react-aria-testing
description: Testing patterns for react-aria-components in @repo/design-system. Use when writing tests or Storybook play functions for design system components. Covers hover/focus/keyboard interaction, why userEvent.hover() silently fails, and correct patterns for each interaction type.
---

# Testing react-aria-components

Design system: `frontend/design-system/` — Vitest + `@testing-library/react`, Storybook play functions via `@storybook/test`.

---

## Critical: `userEvent.hover()` silently fails with react-aria

**Do NOT use `userEvent.hover()` to test react-aria components.**

react-aria uses its own `useHover` hook internally. In jsdom, `userEvent.hover()` dispatches a `pointerenter` event but `event.currentTarget` is `null`, which causes `useHover` to bail out silently. The hover state is never set, no tooltip/popover opens, and the test appears to pass vacuously.

**Symptom**: test passes, but the hover behavior wasn't actually triggered.

---

## Correct interaction patterns

| Goal | Wrong | Correct |
|------|-------|---------|
| Test tooltip trigger | `userEvent.hover(trigger)` | `userEvent.tab()` — focus via keyboard |
| Test button press | `userEvent.click(btn)` | `userEvent.click(btn)` ✅ (click works fine) |
| Test keyboard nav | `fireEvent.keyDown` | `userEvent.keyboard('{ArrowDown}')` |
| Test focus state | `userEvent.hover` | `userEvent.tab()` or `element.focus()` |
| Test dropdown open | `userEvent.hover(trigger)` | `userEvent.click(trigger)` or `userEvent.tab()` + Enter |

### Tooltip — correct test pattern

```tsx
it('shows tooltip on focus', async () => {
  const user = userEvent.setup()
  render(<Tooltip content="Hello"><Button>trigger</Button></Tooltip>)
  
  await user.tab() // focuses the Button (react-aria registers focus listeners)
  expect(screen.getByRole('tooltip')).toBeInTheDocument()
})
```

### Storybook play function — tooltip

```tsx
play: async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const trigger = canvas.getByRole('button')
  await userEvent.tab() // NOT hover
  await expect(canvas.getByRole('tooltip')).toBeInTheDocument()
}
```

---

## data-* attribute testing (react-aria state)

react-aria sets state via data attributes, not CSS classes:

| State | Attribute | Tailwind v4 selector |
|-------|-----------|----------------------|
| Hovered | `data-hovered` | `data-hovered:bg-accent` |
| Focused | `data-focused` | `data-focused:ring-2` |
| Selected | `data-selected` | `data-selected:font-bold` |
| Disabled | `data-disabled` | `data-disabled:opacity-50` |
| Pressed | `data-pressed` | `data-pressed:scale-95` |

**Tailwind v3 syntax `data-[hovered]:` does NOT work in v4** — use `data-hovered:` without brackets.

To assert state in tests:
```tsx
expect(element).toHaveAttribute('data-hovered', 'true')
```

---

## Storybook plays — mandatory checklist

Every story that tests interaction MUST have a `play` function. Minimum for interactive components:

```tsx
play: async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  // 1. Find the trigger
  const trigger = canvas.getByRole('button', { name: /open/i })
  // 2. Interact
  await userEvent.click(trigger)
  // 3. Assert the outcome
  await expect(canvas.getByRole('dialog')).toBeInTheDocument()
}
```

No play function = incomplete story for any component with open/close, focus, keyboard, or selection behavior.

---

## Storybook browser tests (Chromium via `@storybook/addon-vitest`)

Play functions run in a real browser. Deux règles critiques qui n'existent pas en jsdom.

### 1. `findByRole` (async) pour la première query — Suspense i18n

Le decorator `intlDecorator` utilise `use(dictionaryPromise)` (React Suspense). La story peut rendre `<div />` vide le temps que le cache i18n se charge. `getByRole` (sync) rate ce cas.

**❌** :
```tsx
const input = canvas.getByRole('textbox', { name: /label/i })  // peut trouver <div /> vide
```

**✅** :
```tsx
const input = await canvas.findByRole('textbox', { name: /label/i })  // attend la résolution Suspense
```

Utiliser `findByRole` pour la **première** query de la play function. Les queries suivantes peuvent rester sync si le composant est déjà monté.

### 2. Select / ListBox — options dans un portal

react-aria `Select` rend ses options dans `document.body` via un portal. `canvas.getByRole('option')` ne les trouvera pas.

**Pattern correct** :
```tsx
// Ouvrir
await userEvent.click(canvas.getByRole('button', { name: /genre/i }))
// Attendre le listbox (dans document.body)
const listbox = await within(document.body).findByRole('listbox')
// Cliquer la première option
await userEvent.click(within(listbox).getAllByRole('option')[0])
// Ou par texte (sans avoir besoin du role) :
await userEvent.click(within(document.body).getByText('Male'))
```

**Vérifier la sélection** : après le clic, le listbox se ferme et le trigger affiche la valeur — `canvas.getByText('Male')` dans le canvas (pas document.body).

### 3. Attendre les effets asynchrones post-interaction

Après une interaction qui modifie l'état du formulaire, utiliser `waitFor` pour laisser React commettre :

```tsx
import { waitFor } from 'storybook/test'

await userEvent.click(within(listbox).getAllByRole('option')[0])
await waitFor(() => {
  expect(canvas.getByRole('button', { name: /submit/i })).not.toBeDisabled()
})
```
