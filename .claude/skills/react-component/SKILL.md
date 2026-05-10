---
name: react-component
description: Crée ou modifie un composant React dans l'application web (src/<Feature>/ui/). Applique les règles ESLint/Prettier du projet, découpe en sous-composants, branche l'i18n via FormattedMessage/useIntl, priorise les composants du Design System (@repo/design-system), et génère des tests co-localisés. Invoquer dès que l'utilisateur veut créer, modifier ou ajouter un composant React dans le frontend (web-application) : "créer un composant", "ajouter une page", "faire un formulaire", "nouveau composant", "implémenter l'affichage", "créer la vue". Ne pas confondre avec design-system-component (qui cible @repo/design-system) ni frontend-feature-module (qui scaffolde un module complet).
---

# React Component — Web Application

Composants dans `frontend/web-application/src/<Feature>/ui/`.
Design System : `@repo/design-system` (react-aria + Tailwind CSS v4).
i18n : react-intl via `@I18n/translation`.

---

## 1 — Code style (ESLint + Prettier)

Ces règles sont enforced par le linter. Les violer crée des erreurs CI.

### Imports
```tsx
// ✅ type imports inline
import { type FC, type ReactNode } from 'react'
import { type Team } from '../domain/Team'

// ❌ import type séparé
import type { FC } from 'react'
```

### Composants : toujours arrow function + export const
```tsx
// ✅
export const TeamCard = ({ team }: Props) => (
  <div>{team.name}</div>
)

// ❌
export function TeamCard({ team }: Props) {
  return <div>{team.name}</div>
}
```

### Autres règles actives
- `curly: all` — toujours des accolades sur les blocs `if/else/for`
- `object-shorthand` — `{ name }` pas `{ name: name }`
- `prefer-template` — `` `${a} ${b}` `` pas `a + ' ' + b`
- `arrow-body-style: as-needed` — corps implicite si une seule expression
- `no-nested-ternary` — décomposer en variables ou sous-composants

### Prettier
- `singleQuote: true`, `semi: false`, `printWidth: 120`
- `trailingComma: es5`, `arrowParens: avoid`, `tabWidth: 2`

---

## 2 — Design System en priorité

Avant d'écrire du HTML brut, chercher dans `@repo/design-system` :

| Besoin | Composant DS |
|--------|-------------|
| Bouton | `Button` |
| Input texte | `Input`, `Label` |
| Carte | `Card` (ou `Card.Container`, `Card.Title`) |
| Dialogue / Modal | `Dialog` |
| Dropdown | `DropdownMenu`, `DropdownMenuItem` |
| Badge | `Badge` |
| Tableau | `Table`, `TableRow`, `TableCell` |
| Layout | `Layout.Root`, `Layout.Content`, `Layout.Footer` |
| Liste virtualisée | `List.Root`, `List.Item` |
| Grille virtualisée | `Grid.Root`, `Grid.Item` |
| Séparateur | `Separator` |
| Skeleton | `Skeleton` |
| Toast | via `useToast()` |

Si le composant n'existe pas dans le DS, utiliser HTML sémantique + classes Tailwind.

---

## 3 — i18n : tout texte visible doit être traduit

### Règle fondamentale

**Jamais de string littérale dans le JSX.** Toujours passer par react-intl.

```tsx
// ✅ — texte dans JSX
import { FormattedMessage, FormattedDate, FormattedNumber } from '@I18n/translation'

<Button><FormattedMessage id="team.create" /></Button>
<span><FormattedDate value={match.scheduledAt} day="numeric" month="short" /></span>
<span><FormattedNumber value={stats.wins} /></span>

// ✅ — attributs (placeholder, aria-label, title) → useIntl
import { useIntl } from '@I18n/translation'

const intl = useIntl()
<input placeholder={intl.formatMessage({ id: 'team.namePlaceholder' })} />
<button aria-label={intl.formatMessage({ id: 'team.deleteAriaLabel' })} />
```

### Exceptions autorisées
- Valeurs dynamiques pures : `{team.name}`, `{user.email}`, `{count}`
- Contenu purement iconographique (`<Icon />`)
- Chaînes debug/dev non visibles à l'utilisateur

### Nommage des clés

Structure : `<feature>.<composant>.<label>` en camelCase.

```json
// fr.json
{
  "team": {
    "create": "Créer une équipe",
    "namePlaceholder": "Nom de l'équipe",
    "deleteAriaLabel": "Supprimer l'équipe",
    "stats": {
      "matchCount": "Matchs joués"
    }
  }
}
```

### Workflow obligatoire

Quand tu ajoutes une clé i18n :
1. Ajouter dans `src/I18n/locales/fr.json`
2. Ajouter dans `src/I18n/locales/en.json` (traduction anglaise)
3. Les deux fichiers doivent toujours avoir les mêmes clés

---

## 4 — Découpe en sous-composants

### Règle de découpe

Extraire dans un fichier séparé dès que :
- Le bloc dépasse ~25 lignes
- La responsabilité est distincte (afficher UN item vs afficher UNE liste)
- Le bloc est réutilisé dans plusieurs parents

### Structure dans un même dossier

```
src/Team/ui/TeamList/
├── TeamList.tsx          # Orchestrateur (boucle, état, pagination)
├── TeamListItem.tsx      # Rendu d'une ligne
├── TeamListEmpty.tsx     # État vide
├── TeamList.test.tsx     # Tests de TeamList
└── TeamListItem.test.tsx # Tests de TeamListItem
```

Chaque sous-composant a son propre fichier et son propre test si sa logique est non-triviale.

### Ce que le composant parent doit faire
- Passer les données via props à ses enfants
- Gérer les états (loading, empty, error) en haut de la hiérarchie
- Ne pas dupliquer de logique présente dans un hook application

---

## 5 — Tests co-localisés

Fichier : `NomComposant.test.tsx` dans le même dossier.

### react-intl est globalement mocké

`tests/setup.ts` contient `vi.mock('react-intl')`. Conséquences :
- **Pas besoin d'`IntlProvider`** dans les tests — ne pas l'importer
- **`FormattedMessage` rend son `id`** comme texte brut → asserter sur la **clé**, pas la valeur traduite
- **`useIntl().formatMessage()`** rend aussi la clé → tester l'attribut `aria-label="maClé.i18n"`

```tsx
// ✅ — tester la clé i18n, pas la traduction
expect(screen.getByText('teamCard.view')).toBeInTheDocument()
expect(screen.getByRole('button', { name: 'teamCard.view' })).toBeInTheDocument()

// ❌ — ne pas tester la chaîne traduite
expect(screen.getByText('Voir')).toBeInTheDocument()
```

### Composant pur (props only, sans hooks réseau)

```tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { type ReactNode } from 'react'
import { TeamCard } from './TeamCard'

// react-intl globalement mocké — pas d'IntlProvider nécessaire
const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
)

describe('TeamCard', () => {
  it('affiche le nom de l\'équipe', () => {
    render(<TeamCard team={{ id: '1', name: 'Seniors A', color: '#e53e3e' }} />, { wrapper })
    expect(screen.getByText('Seniors A')).toBeInTheDocument()
  })

  it('renders the view button label', () => {
    render(<TeamCard team={{ id: '1', name: 'Seniors A' }} />, { wrapper })
    expect(screen.getByText('teamCard.view')).toBeInTheDocument()
  })
})
```

> `MemoryRouter` est requis si le composant utilise `useNavigate` ou `<Link>`.

### Hook application (avec mutation ou query)

```ts
import { renderHookWithProviders } from '@Common/testUtils'
import { useTeamForm } from './useTeamForm'

describe('useTeamForm', () => {
  it('expose isPending false initialement', () => {
    const { result } = renderHookWithProviders(() => useTeamForm())
    expect(result.current.isPending).toBe(false)
  })
})
```

### Ce qu'il faut couvrir
- Rendu nominal (données réelles, pas de mock vide)
- État vide / absent (props undefined, tableau vide)
- Interactions utilisateur clés (`userEvent.click`, `userEvent.type`)
- Textes i18n : tester la présence de l'élément, pas la chaîne traduite

---

## 6 — Checklist avant commit

```bash
pnpm --filter application-material lint          # Zéro erreur ESLint
pnpm --filter application-material check:format  # Zéro erreur Prettier
pnpm --filter application-material check:types   # Zéro erreur TypeScript
pnpm --filter application-material test          # Tests co-localisés passent
```

| Règle | Vérification |
|-------|-------------|
| Pas de string littérale dans JSX | grep `">Texte<"` dans les fichiers modifiés → zéro |
| Clés i18n dans fr.json ET en.json | Les deux fichiers ont les mêmes clés |
| `export const` + arrow | Pas de `function NomComposant` exportée |
| Sous-composants dans fichiers séparés | Pas de composant anonyme inline > 25 lignes |
| Tests co-localisés | Chaque `.tsx` modifié a son `.test.tsx` |
| DS en priorité | Pas de `<button>` brut quand `<Button>` DS existe |