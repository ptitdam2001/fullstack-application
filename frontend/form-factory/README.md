# @repo/form-factory

Headless form factory for the monorepo. Wraps [react-hook-form](https://react-hook-form.com/) and [Zod](https://zod.dev/) into a type-safe factory pattern. Zero UI — the caller decides how to render.

## Concepts

**Why headless?** The factory provides logic and type safety only. Any UI library (or plain HTML) can be used in the render props. This keeps the form layer decoupled from the design system.

**Why factory?** `createFormFactory` is called once at module level — outside the component. It closes over the schema and returns a stable `useForm` hook. Components never repeat `useForm<MyType>({ resolver: zodResolver(MySchema) })`.

**`Form` component:** returned by `useForm()`, it wraps `<form>` and calls `handleSubmit` internally. Pass your submit handler directly as `onSubmit` — no `form.handleSubmit()` call needed. In development (`import.meta.env.DEV`), `@hookform/devtools` is mounted automatically.

**What it does not do:** render labels, inputs, error messages. Pass a `children` render prop and use whatever components you like.

---

## Installation

Add to the consuming package's `package.json`:

```json
{
  "dependencies": {
    "@repo/form-factory": "workspace:*"
  }
}
```

---

## Quick Start

```tsx
import { createFormFactory } from '@repo/form-factory'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

// ① Define once at module level
const loginFactory = createFormFactory({ schema: loginSchema })

type LoginValues = z.infer<typeof loginSchema>

function LoginForm() {
  const { form, Field, Form } = loginFactory.useForm({ mode: 'onBlur' })

  const onSubmit = async (data: LoginValues) => {
    await signIn(data.email, data.password)
  }

  return (
    <Form onSubmit={onSubmit}>
      <Field name="email">
        {({ field, fieldState }) => (
          <label>
            Email
            <input type="email" {...field} />
            {fieldState.error && <span role="alert">{fieldState.error.message}</span>}
          </label>
        )}
      </Field>

      <Field name="password">
        {({ field, fieldState }) => (
          <label>
            Password
            <input type="password" {...field} />
            {fieldState.error && <span role="alert">{fieldState.error.message}</span>}
          </label>
        )}
      </Field>

      <button type="submit" disabled={!form.formState.isValid}>
        Sign in
      </button>
    </Form>
  )
}
```

---

## API Reference

### `createFormFactory(config)`

Creates a factory bound to a Zod schema.

```ts
function createFormFactory<TSchema extends ZodType<FieldValues, FieldValues>>(config: {
  schema: TSchema
}): FormFactory<z.output<TSchema>>
```

**Parameters:**

| Param | Type | Description |
|---|---|---|
| `config.schema` | `ZodType<FieldValues, FieldValues>` | Zod schema. Both input and output must extend `FieldValues`. Schemas with `.transform()` that change the shape are not supported. |

**Returns:** a `FormFactory` object with a single method: `useForm`.

---

### `factory.useForm(options?)`

React hook. Must be called inside a component.

```ts
factory.useForm(options?: Omit<UseFormProps<TValues>, 'resolver'>): {
  form: UseFormReturn<TValues>
  Field: FieldComponent<TValues>
  FieldArray: FieldArrayComponent<TValues>
  Form: FormComponent<TValues>
}
```

**Parameters:** all [react-hook-form `useForm` options](https://react-hook-form.com/docs/useform) except `resolver` (pre-wired to `zodResolver`).

| Return value | Description |
|---|---|
| `form` | Full react-hook-form return — `formState`, `watch`, `setValue`, `setError`, `reset`, etc. |
| `Field` | Headless render-prop component. Type-safe: `name` is constrained to the schema's keys. |
| `FieldArray` | Headless render-prop component for array fields. |
| `Form` | Headless `<form>` wrapper. `onSubmit` is required and typed `SubmitHandler<TValues>` — `handleSubmit` is called internally. DevTools auto-mounted in DEV. |

---

### `Form`

```tsx
<Form onSubmit={onSubmit} className="...">
  {/* fields */}
</Form>
```

**Props:**

| Prop | Type | Description |
|---|---|---|
| `onSubmit` | `SubmitHandler<TValues>` | **Required.** Called with validated form data. `handleSubmit` is wired internally. |
| `...rest` | `React.HTMLProps<HTMLFormElement>` minus `onSubmit` | Any standard `<form>` attribute (`className`, `name`, `id`, …) |

**DevTools:** when `import.meta.env.DEV` is `true`, `@hookform/devtools` is rendered automatically. Dead-code-eliminated in production builds by Vite.

---

### `Field`

```tsx
<Field name="fieldName">
  {({ field, fieldState }) => (
    // render anything here
  )}
</Field>
```

**Render prop args:**

| Prop | Type | Description |
|---|---|---|
| `field` | `ControllerRenderProps` | Spread onto an input: `value`, `onChange`, `onBlur`, `ref`, `name` |
| `fieldState` | `ControllerFieldState` | `invalid`, `error`, `isDirty`, `isTouched` |

**Important:** `Field` has a stable reference (created once with `useRef`). It is safe to use as a JSX element — React will not unmount/remount it between renders.

---

### `FieldArray`

For dynamic lists of fields backed by an array in the schema.

```tsx
<FieldArray name="arrayField">
  {({ fields, append, remove, insert, swap, move, replace, update, prepend }) => (
    // render the array here
  )}
</FieldArray>
```

**Render prop args:** the full return value of react-hook-form's [`useFieldArray`](https://react-hook-form.com/docs/usefieldarray).

| Key props | Description |
|---|---|
| `fields` | Array of items, each with a stable `id` (used as `key`) |
| `append(value)` | Add an item at the end |
| `prepend(value)` | Add an item at the beginning |
| `remove(index)` | Remove by index |
| `insert(index, value)` | Insert at position |
| `swap(indexA, indexB)` | Swap two items |
| `move(from, to)` | Move item to position |
| `replace(values)` | Replace the entire array |
| `update(index, value)` | Update one item |

---

## Examples

### Array of fields

```tsx
const teamSchema = z.object({
  name: z.string().min(1),
  players: z.array(z.object({ name: z.string().min(1) })),
})

const teamFactory = createFormFactory({ schema: teamSchema })

type TeamValues = z.infer<typeof teamSchema>

function TeamForm() {
  const { form, Field, FieldArray, Form } = teamFactory.useForm({
    mode: 'all',
    defaultValues: { name: '', players: [] },
  })

  const onSubmit = async (data: TeamValues) => {
    await saveTeam(data)
  }

  return (
    <Form onSubmit={onSubmit}>
      <Field name="name">
        {({ field, fieldState }) => (
          <>
            <input placeholder="Team name" {...field} />
            {fieldState.error && <span>{fieldState.error.message}</span>}
          </>
        )}
      </Field>

      <FieldArray name="players">
        {({ fields, append, remove }) => (
          <>
            {fields.map((item, index) => (
              <div key={item.id}>
                <Field name={`players.${index}.name` as const}>
                  {({ field }) => <input placeholder="Player name" {...field} />}
                </Field>
                <button type="button" onClick={() => remove(index)}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => append({ name: '' })}>Add player</button>
          </>
        )}
      </FieldArray>

      <button type="submit" disabled={!form.formState.isValid || !form.formState.isDirty}>
        Save
      </button>
    </Form>
  )
}
```

### Extended schema (with `.refine()`)

```tsx
const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(1),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const registerFactory = createFormFactory({ schema: registerSchema })

type RegisterValues = z.infer<typeof registerSchema>

function RegisterForm() {
  const { form, Field, Form } = registerFactory.useForm({ mode: 'onBlur' })

  const onSubmit = async (data: RegisterValues) => {
    await register({ email: data.email, password: data.password })
  }

  return (
    <Form onSubmit={onSubmit}>
      {/* fields */}
    </Form>
  )
}
```

### Default values

```tsx
const { form, Field, Form } = teamFactory.useForm({
  mode: 'all',
  defaultValues: { name: 'Paris FC', players: [{ name: 'Alice' }] },
})
```

### Watching a field value

```tsx
const { form, Field, Form } = factory.useForm({ mode: 'onChange' })
const password = form.watch('password') ?? ''
```

### Conditional submit button (CRUD)

```tsx
<button
  type="submit"
  disabled={!form.formState.isValid || !form.formState.isDirty || isPending}
>
  Save
</button>
```

---

## Integration with @repo/design-system

The factory is UI-agnostic. Plug any DS component into the render prop:

```tsx
import { Input, TextField, FieldError } from '@repo/design-system'

<Field name="email">
  {({ field, fieldState }) => (
    <TextField isInvalid={fieldState.invalid}>
      <Input type="email" {...field} />
      {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
    </TextField>
  )}
</Field>
```

```tsx
import { Select, Button, SelectValue, SelectContent, SelectItem } from '@repo/design-system'

<Field name="teamId">
  {({ field, fieldState }) => (
    <Select
      selectedKey={field.value ?? null}
      onSelectionChange={(key) => field.onChange(key !== null ? String(key) : '')}
      isInvalid={fieldState.invalid}
    >
      <Button><SelectValue /></Button>
      <SelectContent>
        {teams.map((t) => <SelectItem key={t.id} id={t.id}>{t.name}</SelectItem>)}
      </SelectContent>
    </Select>
  )}
</Field>
```

**Note on `Select`:** react-aria uses `Key = string | number` and `null` for unselected, while RHF uses `undefined`. Always convert: `key !== null ? String(key) : ''`.

---

## Type Safety

The schema drives all types. `name` on `Field` and `FieldArray` is constrained to the schema's keys — TypeScript will error if you mistype a field name.

```tsx
const factory = createFormFactory({ schema: z.object({ email: z.string() }) })
const { Field } = factory.useForm()

<Field name="email">   {/* ✅ */}
<Field name="emial">   {/* ❌ TypeScript error: "emial" is not a key of the schema */}
```

`onSubmit` on `Form` is typed `SubmitHandler<TValues>` — `data` receives `{ email: string }`, not `any`.

---

## Constraints

- Schemas with `.transform()` that change the shape (e.g., string → number) are not supported by the generic. Use `z.coerce.number()` within the field type instead.
- `FieldArray` requires the schema to declare the field as `z.array(...)`.
- Nest at most one level of `FieldArray` per form (deeply nested arrays are untested).
- The factory requires a **static schema** — schemas selected conditionally at runtime based on props require splitting into separate components, each with its own factory.
