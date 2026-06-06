# @repo/form-factory — Package de formulaires headless

## Contexte et motivation

L'application comportait 6 formulaires utilisant chacun le même triplet `useForm + zodResolver + Controller` de react-hook-form. Ce boilerplate représentait ~30 lignes par formulaire, sans garantie de cohérence entre les implémentations.

`@repo/form-factory` encapsule ce triplet dans une factory typée, en exposant une API minimale qui cache complètement react-hook-form au développeur.

---

## Emplacement dans le monorepo

```text
frontend/
├── form-factory/           # @repo/form-factory
│   ├── src/
│   │   ├── createFormFactory.tsx   # Implémentation principale
│   │   └── index.ts                # Exports publics
│   └── tests/
│       └── createFormFactory.test.tsx
├── design-system/          # @repo/design-system
└── web-application/        # application-material
```

Le package est déclaré dans `frontend/pnpm-workspace.yaml` et consommé par `application-material` via `workspace:*`.

---

## Principe — Factory pattern headless

La factory est créée **une fois au niveau module** (hors composant) avec un schéma Zod statique. Elle retourne un hook `useForm()` qui expose les primitives nécessaires à la construction du formulaire.

```ts
// ① Créer la factory — hors composant, une fois par formulaire
const myFormFactory = createFormFactory({ schema: MyZodSchema })

// ② Dans le composant React
const { form, Field, FieldArray, Form } = myFormFactory.useForm({ mode: 'onBlur' })
```

Le développeur ne manipule jamais `Controller`, `useForm`, ni `zodResolver` directement.

---

## API publique

### `createFormFactory(config)`

| Paramètre       | Type                          | Description                        |
| --------------- | ----------------------------- | ---------------------------------- |
| `config.schema` | `ZodType<FieldValues>`        | Schéma Zod statique du formulaire  |

Retourne un objet `{ useForm }`.

### `factory.useForm(options?)`

Options : tout `UseFormProps` de react-hook-form sauf `resolver` (géré par la factory).

Retourne `{ form, Field, FieldArray, Form }` :

| Retour       | Type                              | Description                                                           |
| ------------ | --------------------------------- | --------------------------------------------------------------------- |
| `form`       | `UseFormReturn<z.output<Schema>>` | API react-hook-form complète : `handleSubmit`, `watch`, `formState`… |
| `Field`      | `FieldComponent<TValues>`         | Wrapper typé de `Controller` — render prop `children`                 |
| `FieldArray` | `FieldArrayComponent<TValues>`    | Wrapper typé de `useFieldArray` — render prop `children`              |
| `Form`       | `FormComponent`                   | `<form>` headless + DevTools auto en mode DEV                         |

### `Form` — DevTools intégré

`Form` est retourné par `useForm()` et capture `control` en closure. En développement (`import.meta.env.DEV`), `@hookform/devtools` s'affiche automatiquement. En production, Vite dead-code-elimine le bloc DevTools.

Aucun prop supplémentaire requis — `<Form onSubmit={...} className={...}>` suffit.

---

## Schémas Zod supportés

| Cas | Pattern |
|-----|---------|
| Schéma SDK direct | `createFormFactory({ schema: LoginBody })` |
| Schéma étendu avec champs UI-only | `BaseSchema.extend({ confirmPassword: z.string() }).refine(...)` |
| Schéma créé manuellement | `z.object({ name: z.string().min(1), ... })` |

**Contrainte :** le schéma doit être **statique** (défini à la compilation). Un schéma sélectionné dynamiquement selon une prop runtime (ex. create vs update avec des shapes différentes) est incompatible avec le pattern factory — utiliser `useForm` de react-hook-form directement dans ce cas.

---

## Exemple complet

```tsx
import { createFormFactory } from '@repo/form-factory'
import { LoginBody } from '@Sdk/authentication/authentication.zod'
import { ControlledTextInput } from '@Common/Input/TextInput/ControlledTextInput'
import { Button } from '@repo/design-system'
import { useIntl, FormattedMessage } from 'react-intl'

const signinFormFactory = createFormFactory({ schema: LoginBody })

export const SigninForm = () => {
  const intl = useIntl()
  const { form, Field, Form } = signinFormFactory.useForm({ mode: 'onBlur' })

  return (
    <Form onSubmit={form.handleSubmit(async data => { /* ... */ })} className="flex flex-col">
      <Field name="email">
        {({ field, fieldState }) => (
          <ControlledTextInput
            {...field}
            fieldState={fieldState}
            label={intl.formatMessage({ id: 'auth.email' })}
            type="email"
          />
        )}
      </Field>
      <Button type="submit" isDisabled={form.formState.isSubmitting}>
        <FormattedMessage id="auth.signin" />
      </Button>
    </Form>
  )
}
```

---

## Modes de validation disponibles

| Mode | Déclenchement | Cas d'usage recommandé |
|------|--------------|------------------------|
| `onBlur` | Au blur du champ | Auth, inscription — retour sans interrompre la saisie |
| `onChange` | À chaque frappe | Indicateurs temps-réel (force mot de passe) |
| `onSubmit` | À la soumission | Formulaires courts et simples |
| `onTouched` | Blur puis onChange | Compromis entre onBlur et onChange |
| `all` | onBlur + onChange | CRUD avec bouton Submit conditionnel (`isValid && isDirty`) |

---

## Formulaires migrés

| Formulaire | Fichier | Mode |
|-----------|---------|------|
| `SigninForm` | `Auth/ui/SigninForm/SigninForm.tsx` | `onBlur` |
| `RegisterForm` | `Auth/ui/RegisterForm/RegisterForm.tsx` | `onBlur` |
| `ForgottenPasswordForm` | `Auth/ui/ForgottenPasswordForm/ForgottenPasswordForm.tsx` | `onBlur` |
| `ResetPasswordForm` | `Auth/ui/ResetPasswordForm/ResetPasswordForm.tsx` | `onBlur` |
| `AreaForm` | `Settings/ui/AreaForm.tsx` | `all` |
| `CreateTeamForm` | `Teams/ui/TeamForm/CreateTeamForm.tsx` | `all` |
| `UpdateTeamForm` | `Teams/ui/TeamForm/UpdateTeamForm.tsx` | `all` |

`TeamForm` conserve un rôle de dispatcher (`teamId` → `UpdateTeamForm`, sinon → `CreateTeamForm`) car create et update ont des schémas de shapes différentes.

---

## Tests

Les tests unitaires de la factory se trouvent dans `frontend/form-factory/src/createFormFactory.test.tsx`. Ils couvrent :

- `Field` : rendu des children, accès à `field` et `fieldState`
- `handleSubmit` : déclenchement avec valeurs valides, blocage avec valeurs invalides
- `FieldArray` : append, remove, accès aux champs de l'array
- Stabilité des références : `Field` et `FieldArray` ne changent pas de référence entre renders

`@hookform/devtools` est mocké dans le setup de test (`vi.mock('@hookform/devtools', () => ({ DevTool: () => null }))`).

---

## Dépendances

| Package | Rôle |
|---------|------|
| `react-hook-form` | Gestion d'état des formulaires (encapsulé) |
| `@hookform/resolvers` | Pont entre react-hook-form et Zod |
| `@hookform/devtools` | DevTools de débogage (actif uniquement en DEV) |
| `zod` | Validation et inférence de types |
