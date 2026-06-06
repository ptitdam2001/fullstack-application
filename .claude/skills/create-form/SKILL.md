---
name: create-form
description: Crée un formulaire React dans le web-application en utilisant @repo/form-factory (createFormFactory + Field + Form). Invoquer dès que l'utilisateur veut créer ou migrer un formulaire dans le frontend : "créer un formulaire", "ajouter un form", "migrer useForm vers la factory", "nouveau formulaire", "create form", "add form". Ne pas invoquer pour les composants qui ne sont pas des formulaires.
---

# Create Form — @repo/form-factory

Les formulaires dans `frontend/web-application/src/` utilisent `@repo/form-factory`.

Stack : `@repo/form-factory` + `react-hook-form` (encapsulé) + Zod + `@repo/design-system`.

---

## Étape 1 — Schéma Zod

Demander :

> **"Le formulaire se base-t-il sur un schéma Zod existant ?"**
>
> - **Oui** → lequel ? (ex. `LoginBody` de `@Sdk/authentication/authentication.zod`, `CreateTeamBody` de `@Sdk/team/team.zod`…). Chercher dans `src/sdk/generated/` si l'utilisateur ne sait pas le chemin exact.
> - **Non** → collecter les champs :

Si schéma à créer, demander pour **chaque champ** :
- **Nom** (ex. `email`, `firstName`)
- **Type de valeur** : `string` / `number` / `boolean` / `date` / tableau / objet imbriqué
- **Obligatoire ?** (`required` ou `optional`)
- **Contraintes** éventuelles (longueur min/max, format email, uuid, regex…)

Puis générer le schéma Zod correspondant avant d'écrire le composant.

Si le schéma SDK existe mais nécessite des **champs UI-only** (ex. `confirmPassword`, `confirmEmail`) : étendre via `.extend()` + `.refine()` (voir section dédiée plus bas).

---

## Étape 2 — Mode de validation

Demander :

> **"Quel mode de validation pour ce formulaire ?"**

| Mode | Déclenchement | Cas d'usage |
|------|--------------|-------------|
| `onBlur` | Valide quand le champ perd le focus | Formulaires classiques (login, inscription) — retour rapide sans interrompre la saisie |
| `onChange` | Valide à chaque frappe | Champs avec indicateur temps-réel (force du mot de passe, slug auto) |
| `onSubmit` | Valide uniquement à la soumission | Formulaires simples où valider en cours de saisie serait intrusif |
| `onTouched` | Valide au premier blur, puis à chaque frappe | Compromis : silence au départ, feedback en temps-réel après le premier contact |
| `all` | Combine `onBlur` + `onChange` | Formulaires CRUD où `isValid`/`isDirty` doit être exact à tout moment (bouton Submit conditionnel) |

---

## Étape 3 — Implémentation

### API complète

```tsx
const { form, Field, FieldArray, Form } = myFactory.useForm({ mode: 'onBlur' })
```

- **`form`** — `UseFormReturn<z.output<Schema>>` : handleSubmit, watch, formState, setValue…
- **`Field`** — wrapper typé de `Controller`, children render prop
- **`FieldArray`** — wrapper typé de `useFieldArray`, children render prop
- **`Form`** — `<form>` headless avec `@hookform/devtools` auto en DEV (invisible en prod)

### Pattern complet

```tsx
import { createFormFactory } from '@repo/form-factory'
import { MySchema } from '@Sdk/...'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { Button } from '@repo/design-system'
import { useIntl, FormattedMessage } from 'react-intl'

// ① Factory statique — hors composant, une fois par fichier
const myFormFactory = createFormFactory({ schema: MySchema })

type Props = { onFinish?: VoidFunction }

export const MyForm = ({ onFinish }: Props) => {
  const intl = useIntl()
  const { form, Field, Form } = myFormFactory.useForm({ mode: 'onBlur' })

  const onSubmit = form.handleSubmit(async (data) => {
    await someAction(data)
    onFinish?.()
  })

  return (
    <Form onSubmit={onSubmit} className="flex flex-col">
      <Field name="email">
        {({ field, fieldState }) => (
          <ControlledTextInput
            {...field}
            fieldState={fieldState}
            label={intl.formatMessage({ id: 'form.email' })}
            type="email"
          />
        )}
      </Field>
      <Button type="submit" isDisabled={form.formState.isSubmitting}>
        <FormattedMessage id="form.submit" />
      </Button>
    </Form>
  )
}
```

### Schéma inline avec .refine()

```tsx
import { z } from 'zod'
import { BaseSchema } from '@Sdk/...'

const MyFormSchema = BaseSchema.extend({
  confirmPassword: z.string().min(1),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type MyFormValues = z.infer<typeof MyFormSchema>
const myFormFactory = createFormFactory({ schema: MyFormSchema })
```

`.refine()` est supporté — `ZodEffects` étend `ZodType`.

### FieldArray

```tsx
const { form, Field, FieldArray, Form } = myFormFactory.useForm({ mode: 'onBlur' })

<FieldArray name="items">
  {({ fields, append, remove }) => (
    <>
      {fields.map((item, index) => (
        <Field key={item.id} name={`items.${index}.name`}>
          {({ field, fieldState }) => (
            <ControlledTextInput {...field} fieldState={fieldState} label="Name" />
          )}
        </Field>
      ))}
      <Button onPress={() => append({ name: '' })}>Ajouter</Button>
    </>
  )}
</FieldArray>
```

### form.watch — accès aux valeurs en temps-réel

```tsx
const { form, Field, Form } = myFormFactory.useForm({ mode: 'onChange' })
const password = form.watch('password') ?? ''
```

### formState — bouton conditionnel

```tsx
<Button
  type="submit"
  disabled={!form.formState.isValid || !form.formState.isDirty || isPending}
>
  Submit
</Button>
```

### defaultValues

```tsx
const { form, Field, Form } = myFormFactory.useForm({
  defaultValues: { name: existing.name, color: existing.color },
  mode: 'all',
})
```

---

## Étape 4 — Tests unitaires

Co-localiser : `MyForm.test.tsx` dans le même dossier que le composant.

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MyForm } from './MyForm'

// Mock du hook d'action — ne pas tester l'infra dans un test unitaire
const mockProcess = vi.fn()
vi.mock('../../application/useMyAction', () => ({
  useMyAction: () => ({ process: mockProcess, isPending: false }),
}))

describe('MyForm', () => {
  it('affiche les erreurs de validation après blur sur champ vide', async () => {
    const user = userEvent.setup()
    render(<MyForm />)

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    await user.click(emailInput)
    await user.tab() // déclenche blur → validation onBlur

    // react-intl est mocké globalement (tests/setup.ts) — clés i18n retournées telles quelles
    expect(screen.getByText(/form\.email\.error/i)).toBeInTheDocument()
  })

  it('ne soumet pas si le formulaire est invalide', async () => {
    const user = userEvent.setup()
    render(<MyForm />)

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(mockProcess).not.toHaveBeenCalled()
  })

  it('soumet avec les valeurs correctes si le formulaire est valide', async () => {
    const user = userEvent.setup()
    render(<MyForm />)

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(mockProcess).toHaveBeenCalledWith('test@example.com', expect.anything())
  })
})
```

**Contexte de test :**
- `react-intl` mocké globalement dans `tests/setup.ts` — clés retournées telles quelles
- `@hookform/devtools` mocké globalement — pas de DevTool rendu dans les tests
- MSW configuré globalement — utiliser `server.use(...)` dans le `describe` si besoin
- Pas de `MemoryRouter` sauf si le formulaire utilise `useNavigate` / `useSearchParams`
- Ne pas mocker `@repo/form-factory` — tester le comportement réel du formulaire

---

## Étape 5 — Story Storybook avec play

Co-localiser : `MyForm.stories.tsx` dans le même dossier.

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { http, HttpResponse } from 'msw'
import { MyForm } from './MyForm'

const meta = {
  component: MyForm,
  title: 'Feature/MyForm',
} satisfies Meta<typeof MyForm>

export default meta
type Story = StoryObj<typeof meta>

// Story 1 : état par défaut
export const Default: Story = {}

// Story 2 : erreurs de validation (champs vides → blur → erreurs visibles)
export const ValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const emailInput = canvas.getByRole('textbox', { name: /email/i })
    await userEvent.click(emailInput)
    await userEvent.tab() // blur → déclenche validation

    await expect(canvas.getByText(/invalide/i)).toBeInTheDocument()
  },
}

// Story 3 : soumission réussie (MSW mock API)
export const SuccessfulSubmit: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('/api/my-endpoint', () => HttpResponse.json({ id: '123' })),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByRole('textbox', { name: /email/i }), 'test@example.com')
    await userEvent.click(canvas.getByRole('button', { name: /submit/i }))

    await expect(canvas.getByText(/success/i)).toBeInTheDocument()
  },
}
```

**Notes Storybook :**
- `intlDecorator`, `QueryClientProvider`, `ThemeProvider` sont globaux — pas de wrapper manuel
- `DevTool` s'affiche automatiquement dans Storybook (mode DEV) — pas besoin de configuration
- Toujours au moins une story avec `play` couvrant la validation des erreurs
- MSW via `parameters.msw.handlers` pour mocker les appels réseau

---

## Limitation : schéma dynamique

**Ne pas utiliser la factory** quand le schéma dépend d'une prop runtime (ex. create vs update avec des shapes différentes). Les hooks React ne peuvent pas être appelés conditionnellement.

```tsx
// ❌ INTERDIT — hook conditionnel
const factory = teamId ? updateFactory : createFactory
const { form, Field, Form } = factory.useForm(...)  // violation des règles de hooks

// ✅ Alternative : useForm de react-hook-form directement
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
const schema = useMemo(() => teamId ? UpdateSchema : CreateSchema, [teamId])
const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) })
```

---

## Checklist avant commit

- [ ] Schéma Zod identifié ou créé (avec `.extend()` + `.refine()` si champs UI-only)
- [ ] Mode de validation choisi et justifié
- [ ] Factory définie **hors composant** (niveau module)
- [ ] `Form`, `Field` (et `FieldArray` si besoin) destructurés depuis `useForm()`
- [ ] Aucun import de `Controller`, `useForm`, `zodResolver` de `react-hook-form` / `@hookform/resolvers`
- [ ] Tests unitaires : erreurs de validation + soumission invalide + soumission valide
- [ ] Story avec `play` couvrant la validation des erreurs
- [ ] `pnpm check:types` → 0 erreur
- [ ] Strings UI via `<FormattedMessage>` ou `intl.formatMessage()` (pas de hardcode)
