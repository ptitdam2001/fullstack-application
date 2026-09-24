import { createFormFactory } from '@repo/form-factory'
import { Button, Switch, TextInputField, Toast, cn } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { z } from 'zod'
import { type UpdateUserInput, type User, UpdateUserBody } from '../../domain/User'
import { useUserUpdate } from '../../application/useUserUpdate'

// Every field is controlled, so the form holds full values. `lastName` is nullable on User:
// '' stands for "no last name" in the form and must never reach the API (min 1 there).
const AdminUserFormSchema = UpdateUserBody.required().extend({
  lastName: z.string(),
  avatar: z.string(),
})

type AdminUserFormValues = z.infer<typeof AdminUserFormSchema>
type DirtyFields = Partial<Record<keyof AdminUserFormValues, boolean>>

/** Builds the PATCH body from the submitted values, keeping only what the admin actually changed. */
const toUpdatePayload = (values: AdminUserFormValues, dirtyFields: DirtyFields): UpdateUserInput => {
  const changed = (Object.keys(values) as (keyof AdminUserFormValues)[]).filter(key => dirtyFields[key])
  const payload: UpdateUserInput = Object.fromEntries(changed.map(key => [key, values[key]]))
  // The API cannot reset lastName to null (min 1): a cleared last name is left unchanged rather than 400.
  if (payload.lastName === '') {
    delete payload.lastName
  }
  return payload
}

const adminUserFormFactory = createFormFactory({ schema: AdminUserFormSchema })

type Props = {
  user: User
  /** The edited user is the authenticated admin — the API refuses a self-demote, so the switch is locked. */
  isSelf: boolean
  onFinish?: VoidFunction
  className?: string
}

export const AdminUserForm = ({ user, isSelf, onFinish, className }: Props) => {
  const { formatMessage } = useIntl()
  const toast = Toast.useToast()
  const { updateUser, isPending } = useUserUpdate()
  const { form, Field, Form } = adminUserFormFactory.useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName ?? '',
      email: user.email,
      avatar: user.avatar ?? '',
      isAdmin: user.isAdmin,
    },
    mode: 'all',
  })
  // Read both before the JSX: formState is a Proxy that only subscribes to what is read (pitfall 15)
  const isValid = form.formState.isValid
  const isDirty = form.formState.isDirty

  const onSubmit = async (values: AdminUserFormValues) => {
    try {
      await updateUser(user.id, toUpdatePayload(values, form.formState.dirtyFields))
      toast(formatMessage({ id: 'adminUsers.toast.updated' }))
      onFinish?.()
    } catch {
      toast(formatMessage({ id: 'adminUsers.toast.updateError' }))
    }
  }

  return (
    <Form name="adminUserForm" onSubmit={onSubmit} className={cn('flex h-full flex-col gap-3', className)}>
      <Field name="firstName">
        {({ field, fieldState }) => (
          <TextInputField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            label={formatMessage({ id: 'adminUsers.form.firstName' })}
            errorMessage={fieldState.error?.message}
          />
        )}
      </Field>

      <Field name="lastName">
        {({ field, fieldState }) => (
          <TextInputField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            label={formatMessage({ id: 'adminUsers.form.lastName' })}
            errorMessage={fieldState.error?.message}
          />
        )}
      </Field>

      <Field name="email">
        {({ field, fieldState }) => (
          <TextInputField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            type="email"
            label={formatMessage({ id: 'adminUsers.form.email' })}
            errorMessage={fieldState.error?.message}
          />
        )}
      </Field>

      <Field name="avatar">
        {({ field, fieldState }) => (
          <TextInputField
            name={field.name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            type="url"
            label={formatMessage({ id: 'adminUsers.form.avatar' })}
            errorMessage={fieldState.error?.message}
          />
        )}
      </Field>

      <Field name="isAdmin">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <Switch isSelected={field.value} onChange={field.onChange} isDisabled={isSelf}>
              <FormattedMessage id="adminUsers.form.isAdmin" />
            </Switch>
            {isSelf && (
              <p className="text-muted-foreground text-xs">
                <FormattedMessage id="adminUsers.form.isAdmin.selfHint" />
              </p>
            )}
          </div>
        )}
      </Field>

      <div className="flex flex-row-reverse py-1">
        <Button type="submit" variant="outline" isDisabled={!isValid || !isDirty || isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          <FormattedMessage id="adminUsers.form.submit" />
        </Button>
      </div>
    </Form>
  )
}
