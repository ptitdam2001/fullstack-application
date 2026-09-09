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
import { type FC, type ReactNode } from "react";
import { type Team } from "../domain/Team";

// ❌ import type séparé
import type { FC } from "react";
```

### Composants : toujours arrow function + export const

```tsx
// ✅
export const TeamCard = ({ team }: Props) => <div>{team.name}</div>;

// ❌
export function TeamCard({ team }: Props) {
  return <div>{team.name}</div>;
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

| Besoin             | Composant DS                                     |
| ------------------ | ------------------------------------------------ |
| Bouton             | `Button`                                         |
| Input texte        | `Input`, `Label`                                 |
| Carte              | `Card` (ou `Card.Container`, `Card.Title`)       |
| Dialogue / Modal   | `Dialog`                                         |
| Dropdown           | `DropdownMenu`, `DropdownMenuItem`               |
| Badge              | `Badge`                                          |
| Tableau            | `Table`, `TableRow`, `TableCell`                 |
| Layout             | `Layout.Root`, `Layout.Content`, `Layout.Footer` |
| Liste virtualisée  | `List.Root`, `List.Item`                         |
| Grille virtualisée | `Grid.Root`, `Grid.Item`                         |
| Séparateur         | `Separator`                                      |
| Skeleton           | `Skeleton`                                       |
| Toast              | via `useToast()`                                 |

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

## 4 — Découpe : hook de façade + sous-composants

### Logique métier → hook de façade

Le composant `.tsx` reste pur : il appelle un hook `use<Component>.ts` co-localisé et se contente de rendre le JSX. Tout état, effet, handler, appel à un hook application va dans ce hook de façade.

```tsx
// useTeamList.ts — hook de façade
export const useTeamList = () => {
  const { data, isPending } = useTeamListQuery()
  const [filter, setFilter] = useState('')
  const filteredTeams = useMemo(() => data?.filter(t => t.name.includes(filter)), [data, filter])
  return { teams: filteredTeams, isPending, filter, setFilter }
}

// TeamList.tsx — composant pur
export const TeamList = () => {
  const { teams, isPending, filter, setFilter } = useTeamList()
  if (isPending) {
    return <Skeleton />
  }
  return (/* JSX uniquement */)
}
```

### Règle de découpe des sous-composants

Extraire dans un fichier séparé dès que :

- Le bloc dépasse ~25 lignes
- La responsabilité est distincte (afficher UN item vs afficher UNE liste)
- Le bloc est réutilisé dans plusieurs parents

**1 composant = 1 fichier**, toujours. Exception : un sous-composant vraiment petit (quelques lignes, pas de logique propre, ex. juste un wrapper de mise en forme) peut rester inline dans le fichier parent.

### Sous-composants non réutilisés ailleurs → dossier `components/`

Un sous-composant qui n'est utilisé que par ce composant (pas réutilisé ailleurs) va dans un sous-dossier `components/` du dossier du composant parent.

```
src/Team/ui/TeamList/
├── TeamList.tsx              # Composant pur — appelle useTeamList(), rend le JSX
├── useTeamList.ts             # Hook de façade — état, logique métier, handlers
├── useTeamList.test.ts        # Tests du hook (si logique non triviale)
├── TeamList.page.tsx          # Page Object pour les tests de TeamList
├── TeamList.test.tsx
└── components/
    ├── TeamListItem.tsx       # Rendu d'une ligne — utilisé uniquement par TeamList
    ├── TeamListItem.page.tsx
    ├── TeamListItem.test.tsx
    ├── TeamListEmpty.tsx      # État vide — utilisé uniquement par TeamList
    ├── TeamListEmpty.page.tsx
    └── TeamListEmpty.test.tsx
```

Un sous-composant réutilisé par plusieurs composants du **même domaine** reste dans ce domaine (`src/<Feature>/ui/`), il ne remonte pas dans `@repo/design-system` : le DS ne contient que des composants de base génériques (non métier). Il ne remonte en composant partagé `@Common` que s'il est réellement transverse à plusieurs domaines métier.

### Ce que le composant parent doit faire

- Rendre le JSX uniquement, déléguer toute logique au hook de façade
- Passer les données via props à ses enfants dans `components/`
- Gérer les états (loading, empty, error) en haut de la hiérarchie
- Ne pas dupliquer de logique présente dans un hook application

---

## 5 — TDD + Page Object Model

### TDD obligatoire

Toujours écrire le test avant l'implémentation :

1. **RED** — écrire le test (et son Page Object) pour le comportement voulu, le voir échouer
2. **GREEN** — écrire le minimum de code (composant / hook de façade) pour le faire passer
3. **REFACTOR** — nettoyer une fois vert (extraction sous-composant, découpe, nommage)

Ne pas écrire de composant sans test qui échoue au préalable.

### Pattern Page Object (POM) pour les composants

Fichier : `NomComposant.page.tsx` dans le même dossier. Il encapsule tout accès au DOM (`render`, `screen`, `fireEvent`) ; le fichier `.test.tsx` n'importe jamais `@testing-library/react` directement — seulement la classe Page.

```tsx
// TeamCard.page.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { TeamCard } from "./TeamCard";
import type { Team } from "../../domain/Team";

const defaultTeam: Team = { id: "1", name: "Seniors A", color: "#e53e3e" };

export class TeamCardPage {
  onViewClick = vi.fn();
  private team: Team;

  constructor(teamOverrides: Partial<Team> = {}) {
    this.team = { ...defaultTeam, ...teamOverrides };
  }

  render() {
    render(<TeamCard team={this.team} onViewClick={this.onViewClick} />);
    return this;
  }

  teamName() {
    return screen.getByText(this.team.name);
  }

  viewButton() {
    return screen.getByRole("button", { name: "teamCard.view" });
  }

  clickViewButton() {
    fireEvent.click(this.viewButton());
    return this;
  }
}
```

```tsx
// TeamCard.test.tsx
import { describe, expect, it } from "vitest";
import { TeamCardPage } from "./TeamCard.page";

describe("TeamCard", () => {
  it("affiche le nom de l'équipe", () => {
    const page = new TeamCardPage().render();
    expect(page.teamName()).toBeInTheDocument();
  });

  it("appelle onViewClick au clic sur le bouton", () => {
    const page = new TeamCardPage().render();
    page.clickViewButton();
    expect(page.onViewClick).toHaveBeenCalledOnce();
  });
});
```

Règles du Page Object :

- Constructeur : fixture par défaut + `Partial<T>` d'overrides
- `render()` retourne `this` pour chaîner
- Getters (`teamName()`, `viewButton()`) exposent les éléments — encapsulent la query RTL (`getByText`, `getByRole`...)
- Actions (`clickViewButton()`) exécutent l'interaction et retournent `this` pour chaîner
- Mocks de callbacks (`vi.fn()`) en propriété publique de la classe

### react-intl est globalement mocké

`tests/setup.ts` contient `vi.mock('react-intl')`. Conséquences :

- **Pas besoin d'`IntlProvider`** dans les tests — ne pas l'importer
- **`FormattedMessage` rend son `id`** comme texte brut → asserter sur la **clé**, pas la valeur traduite
- **`useIntl().formatMessage()`** rend aussi la clé → tester l'attribut `aria-label="maClé.i18n"`

```tsx
// ✅ — dans le Page Object, tester la clé i18n, pas la traduction
viewButton() {
  return screen.getByRole('button', { name: 'teamCard.view' })
}

// ❌ — ne pas tester la chaîne traduite
screen.getByText('Voir')
```

> `MemoryRouter` est requis dans `render()` du Page Object si le composant utilise `useNavigate` ou `<Link>`.

### Hook de façade (logique métier isolée)

Le hook de façade se teste directement, sans Page Object (pas de DOM) :

```ts
// useTeamForm.test.ts
import { renderHookWithProviders } from "@Common/testUtils";
import { useTeamForm } from "./useTeamForm";

describe("useTeamForm", () => {
  it("expose isPending false initialement", () => {
    const { result } = renderHookWithProviders(() => useTeamForm());
    expect(result.current.isPending).toBe(false);
  });
});
```

### Ce qu'il faut couvrir

- Rendu nominal (données réelles, pas de mock vide)
- État vide / absent (props undefined, tableau vide)
- Interactions utilisateur clés (via les actions du Page Object)
- Textes i18n : tester la présence de l'élément par sa clé, pas la chaîne traduite
- Logique métier du hook de façade testée indépendamment du rendu

---

## 6 — Checklist avant commit

```bash
pnpm --filter application-material lint          # Zéro erreur ESLint
pnpm --filter application-material check:format  # Zéro erreur Prettier
pnpm --filter application-material check:types   # Zéro erreur TypeScript
pnpm --filter application-material test          # Tests co-localisés passent
```

| Règle                                 | Vérification                                                   |
| ------------------------------------- | -------------------------------------------------------------- |
| Pas de string littérale dans JSX      | grep `">Texte<"` dans les fichiers modifiés → zéro             |
| Clés i18n dans fr.json ET en.json     | Les deux fichiers ont les mêmes clés                           |
| `export const` + arrow                | Pas de `function NomComposant` exportée                        |
| Sous-composants dans fichiers séparés | Pas de composant anonyme inline > 25 lignes                    |
| Logique métier dans hook de façade    | Le composant `.tsx` ne contient que du JSX                     |
| Sous-composants non réutilisés        | Rangés dans `components/`                                      |
| TDD respecté                          | Le test existait avant l'implémentation                        |
| Tests via Page Object                 | `.test.tsx` n'importe pas `@testing-library/react` directement |
| DS en priorité                        | Pas de `<button>` brut quand `<Button>` DS existe              |
