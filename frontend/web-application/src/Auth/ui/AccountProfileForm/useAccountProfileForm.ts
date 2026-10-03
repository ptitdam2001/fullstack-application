import { useIntl } from 'react-intl'
import { z } from 'zod'
import { Toast } from '@repo/design-system'
import { createFormFactory } from '@repo/form-factory'
import { UpdateMyProfileBody, type UserWithoutPassword } from '../../domain/Account'
import { useUpdateMyProfileAction } from '../../application/useUpdateMyProfileAction'

// The API accepts a partial body; the form always sends both fields and the first name is mandatory.
// The last name is free text here: the API refuses an empty string, so an emptied field is sent as null (onSubmit).
const AccountProfileFormSchema = UpdateMyProfileBody.required({ firstName: true })
  .extend({ lastName: z.string() })
  .refine(values => values.firstName.trim().length > 0, { path: ['firstName'] })

type AccountProfileFormValues = z.infer<typeof AccountProfileFormSchema>

const accountProfileFormFactory = createFormFactory({ schema: AccountProfileFormSchema })

const toFormValues = (user: UserWithoutPassword): AccountProfileFormValues => ({
  firstName: user.firstName ?? '',
  lastName: user.lastName ?? '',
})

export const useAccountProfileForm = (user: UserWithoutPassword) => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const { process, isPending } = useUpdateMyProfileAction()
  // 'all': the submit button depends on isValid/isDirty, which must be exact at every keystroke
  const { form, Field, Form } = accountProfileFormFactory.useForm({ mode: 'all', defaultValues: toFormValues(user) })

  const onSubmit = async (values: AccountProfileFormValues) => {
    try {
      const updated = await process({
        firstName: values.firstName.trim(),
        // An emptied field must clear the last name server-side: the API expects an explicit null
        lastName: values.lastName?.trim() || null,
      })
      // New baseline: the form is pristine again until the next edit
      form.reset(toFormValues(updated))
      toast.success(intl.formatMessage({ id: 'account.profile.success' }))
    } catch {
      toast.error(intl.formatMessage({ id: 'account.profile.error.generic' }))
    }
  }

  // formState is a Proxy: read both flags unconditionally so that both are subscribed to
  const isValid = form.formState.isValid
  const isDirty = form.formState.isDirty

  return { Field, Form, onSubmit, isPending, canSubmit: isValid && isDirty && !isPending }
}
