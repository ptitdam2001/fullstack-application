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

| Mode        | Déclenchement                                | Cas d'usage                                                                                        |
| ----------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `onBlur`    | Valide quand le champ perd le focus          | Formulaires classiques (login, inscription) — retour rapide sans interrompre la saisie             |
| `onChange`  | Valide à chaque frappe                       | Champs avec indicateur temps-réel (force du mot de passe, slug auto)                               |
| `onSubmit`  | Valide uniquement à la soumission            | Formulaires simples où valider en cours de saisie serait intrusif                                  |
| `onTouched` | Valide au premier blur, puis à chaque frappe | Compromis : silence au départ, feedback en temps-réel après le premier contact                     |
| `all`       | Combine `onBlur` + `onChange`                | Formulaires CRUD où `isValid`/`isDirty` doit être exact à tout moment (bouton Submit conditionnel) |

---

## Étape 3 — Implémentation

### API complète

```tsx
const { form, Field, FieldArray, Form } = myFactory.useForm({ mode: 'onBlur' })
```

- **`form`** — `UseFormReturn<z.output<Schema>>` : watch, formState, setValue… (`handleSubmit` géré en interne par `Form`)
- **`Field`** — wrapper typé de `Controller`, children render prop
- **`FieldArray`** — wrapper typé de `useFieldArray`, children render prop
- **`Form`** — `<form>` headless, `onSubmit` requis et typé `SubmitHandler<TValues>`, `handleSubmit` appelé en interne, DevTools auto en DEV

### Pattern complet

```tsx
import { createFormFactory } from '@repo/form-factory'
import { MySchema } from '@Sdk/...'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { Button } from '@repo/design-system'
import { useIntl, FormattedMessage } from 'react-intl'

// ① Factory statique — hors composant, une fois par fichier
const myFormFactory = createFormFactory({ schema: MySchema })

type MyFormValues = z.infer<typeof MySchema>
type Props = { onFinish?: VoidFunction }

export const MyForm = ({ onFinish }: Props) => {
  const intl = useIntl()
  const { form, Field, Form } = myFormFactory.useForm({ mode: 'onBlur' })

  const onSubmit = async (data: MyFormValues) => {
    await someAction(data)
    onFinish?.()
  }

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
}).refine(d => d.password === d.confirmPassword, {
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

⚠️ **Piège : court-circuit du Proxy `formState`**

`form.formState` est un Proxy react-hook-form qui enregistre des subscriptions lors de l'accès aux propriétés. Avec `||`, si `isValid = false`, JavaScript court-circuite et `isDirty` n'est **jamais lu** → aucune subscription créée → le composant ne se re-rend pas quand `isDirty` change.

**❌ Ne pas faire** :

```tsx
// isDirty jamais accédé quand isValid = false → pas de subscription
isDisabled={!form.formState.isValid || !form.formState.isDirty || isPending}
```

**✅ Toujours extraire les deux avant le JSX** pour forcer la création des deux subscriptions :

```tsx
const isValid = form.formState.isValid
const isDirty = form.formState.isDirty
// ...
<Button
  type="submit"
  isDisabled={!isValid || !isDirty || isPending}
>
  Submit
</Button>
```

Même règle pour toute combinaison de propriétés `formState` dans une expression court-circuitée (`||` / `&&`).

Applies to `mode: 'all'` especially — where `isValid`/`isDirty` gate a submit button.

### defaultValues

```tsx
const { form, Field, Form } = myFormFactory.useForm({
  defaultValues: { name: existing.name, color: existing.color },
  mode: 'all',
})
```

---

## Étape 4 — Page Object

Un formulaire `createFormFactory` n'a **pas** de `MyForm.test.tsx` : il est testé par les plays de sa story (étape 5), à travers un Page Object co-localisé. La règle est dans `specifications/00-conventions.md` › Tests.

Co-localiser : `MyForm.page.ts` dans le même dossier que le composant. Référence : `Auth/ui/ForgottenPasswordForm/ForgottenPasswordForm.page.ts`.

```ts
import { userEvent, within } from 'storybook/test'

export class MyFormPage {
  private readonly canvas: ReturnType<typeof within>

  constructor(canvasElement: HTMLElement) {
    this.canvas = within(canvasElement)
  }

  // Requêtes nommées par intention — rôle + nom accessible d'abord
  emailInput() {
    return this.canvas.findByRole('textbox', { name: /email/i })
  }

  // Texte traduit : regex bilingue, Chromium headless rend la locale en-US
  submitButton() {
    return this.canvas.getByRole('button', { name: /submit|envoyer/i })
  }

  emailError() {
    return this.canvas.findByText(/invalid email|email invalide/i)
  }

  toast(matcher: RegExp) {
    return within(document.body).findByText(matcher)
  }

  // Actions chaînables : elles renvoient `this`
  async fillEmail(email: string) {
    await userEvent.type(await this.emailInput(), email)
    return this
  }

  async blurEmail() {
    await userEvent.click(await this.emailInput())
    await userEvent.tab() // blur → déclenche la validation onBlur
    return this
  }

  async submit() {
    await userEvent.click(this.submitButton())
    return this
  }
}
```

- Premier champ en `findBy*` : il peut dépendre d'un rendu asynchrone.
- Un toast se cherche dans `document.body` : il est rendu hors du canvas.
- Le Page Object ne contient pas d'assertion : les `expect` restent dans les plays.

---

## Étape 5 — Story Storybook avec plays

Co-localiser : `MyForm.stories.tsx` dans le même dossier. Les plays tournent dans Chromium (job CI `Storybook plays`) et couvrent les trois cas : erreurs de validation, soumission invalide, soumission valide.

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { http, HttpResponse } from 'msw'
import { MyForm } from './MyForm'
import { MyFormPage } from './MyForm.page'

// Spy sur le body reçu par la route : il remplace le vi.mock du hook applicatif
const onCreate = fn()

const meta = {
  component: MyForm,
  title: 'Feature/MyForm',
  parameters: {
    msw: {
      handlers: [
        http.post('*/my-endpoint', async ({ request }) => {
          onCreate(await request.json())
          return HttpResponse.json({ id: '123' })
        }),
      ],
    },
  },
  beforeEach: () => {
    onCreate.mockClear()
  },
} satisfies Meta<typeof MyForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Rendu initial',
}

export const ValidationErrors: Story = {
  name: 'Champ vide puis blur — erreur de validation affichée',
  play: async ({ canvasElement }) => {
    const page = new MyFormPage(canvasElement)
    await page.blurEmail()

    await expect(await page.emailError()).toBeInTheDocument()
  },
}

export const InvalidSubmit: Story = {
  name: 'Soumission invalide — aucun appel API',
  play: async ({ canvasElement }) => {
    const page = new MyFormPage(canvasElement)
    await page.fillEmail('not-an-email')
    await page.submit()

    await expect(await page.emailError()).toBeInTheDocument()
    await expect(onCreate).not.toHaveBeenCalled()
  },
}

export const SubmitSuccess: Story = {
  name: 'Soumission valide — body envoyé à l’API',
  play: async ({ canvasElement }) => {
    const page = new MyFormPage(canvasElement)
    await page.fillEmail('test@example.com')
    await page.submit()

    await waitFor(() => expect(onCreate).toHaveBeenCalledWith({ email: 'test@example.com' }))
  },
}
```

**Notes Storybook :**

- `intlDecorator`, `QueryClientProvider`, `ThemeProvider` sont globaux — pas de wrapper manuel
- L'i18n est réelle dans les plays (pas de clés brutes) : tout texte traduit se cherche avec une regex bilingue (`/submit|envoyer/i`), Chromium headless rend la locale `en-US`
- `DevTool` s'affiche automatiquement dans Storybook (mode DEV) — pas besoin de configuration
- MSW via `parameters.msw.handlers` ; un handler qui ne sert qu'à une story se met dans les `parameters` de cette story
- Une soumission invalide se prouve par un effet visible (message d'erreur) **et** par le spy jamais appelé
- Ne pas mocker `@repo/form-factory` — les plays testent le comportement réel du formulaire

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
- [ ] Type `{FormName}Values = z.infer<typeof Schema>` déclaré au niveau module
- [ ] `const onSubmit = async (data: {FormName}Values) => { ... }` — pas de `form.handleSubmit()` à l'usage
- [ ] `Form`, `Field` (et `FieldArray` si besoin) destructurés depuis `useForm()`
- [ ] Aucun import de `Controller`, `useForm`, `zodResolver`, `handleSubmit` de `react-hook-form` / `@hookform/resolvers`
- [ ] Aucun `{FormName}.test.tsx` — voir `specifications/00-conventions.md` › Tests
- [ ] Page Object `{FormName}.page.ts` : `within(canvasElement)`, requêtes nommées par intention, actions chaînables, regex bilingues
- [ ] Plays de la story à travers le Page Object : erreurs de validation + soumission invalide + soumission valide
- [ ] `pnpm check:types` → 0 erreur
- [ ] Strings UI via `<FormattedMessage>` ou `intl.formatMessage()` (pas de hardcode)
