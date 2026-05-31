# @repo/form-factory

Headless form factory for the monorepo. Wraps [react-hook-form](https://react-hook-form.com/) and [Zod](https://zod.dev/) into a type-safe factory pattern. Zero UI — the caller decides how to render.

## Concepts

**Why headless?** The factory provides logic and type safety only. Any UI library (or plain HTML) can be used in the render props. This keeps the form layer decoupled from the design system.

**Why factory?** `createFormFactory` is called once at module level — outside the component. It closes over the schema and returns a stable `useForm` hook. Components never repeat `useForm<MyType>({ resolver: zodResolver(MySchema) })`.

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

// Define once at module level
const loginFactory = createFormFactory({
  schema: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
})

function LoginForm({ onSubmit }: { onSubmit: (data: { email: string; password: string }) => void }) {
  const { form, Field } = loginFactory.useForm({ mode: 'onBlur' })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
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
    </form>
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
}
```

**Parameters:** all [react-hook-form `useForm` options](https://react-hook-form.com/docs/useform) except `resolver` (pre-wired to `zodResolver`).

| Return value | Description |
|---|---|
| `form` | Full react-hook-form return — `handleSubmit`, `formState`, `control`, `register`, `watch`, `setValue`, `setError`, `reset`, etc. |
| `Field` | Headless render-prop component. Type-safe: `name` is constrained to the schema's keys. |
| `FieldArray` | Headless render-prop component for array fields. |

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
  players: z.array(
    z.object({ name: z.string().min(1) })
  ),
})

const teamFactory = createFormFactory({ schema: teamSchema })

function TeamForm() {
  const { form, Field, FieldArray } = teamFactory.useForm({
    mode: 'all',
    defaultValues: { name: '', players: [] },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
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
    </form>
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
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const registerFactory = createFormFactory({ schema: registerSchema })
```

### Default values

```tsx
const { form, Field } = teamFactory.useForm({
  mode: 'all',
  defaultValues: { name: 'Paris FC', players: [{ name: 'Alice' }] },
})
```

### Edit mode (create vs update)

```tsx
const teamFactory = createFormFactory({ schema: teamSchema })

function TeamForm({ team }: { team?: Team }) {
  const { form, Field } = teamFactory.useForm({
    mode: 'all',
    defaultValues: team ?? { name: '', players: [] },
  })

  const isEdit = !!team

  return (
    <form onSubmit={form.handleSubmit(isEdit ? onUpdate : onCreate)}>
      {/* ... */}
      <button
        type="submit"
        disabled={!form.formState.isValid || (!isEdit && !form.formState.isDirty)}
      >
        {isEdit ? 'Update' : 'Create'}
      </button>
    </form>
  )
}
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
const { form, Field } = factory.useForm()

<Field name="email">   {/* ✅ */}
<Field name="emial">   {/* ❌ TypeScript error: "emial" is not a key of the schema */}
```

`form.handleSubmit(onSubmit)` is fully typed: `onSubmit` receives `{ email: string }`, not `any`.

---

## Constraints

- Schemas with `.transform()` that change the shape (e.g., string → number) are not supported by the generic. Use `z.coerce.number()` within the field type instead.
- `FieldArray` requires the schema to declare the field as `z.array(...)`.
- Nest at most one level of `FieldArray` per form (deeply nested arrays are untested).