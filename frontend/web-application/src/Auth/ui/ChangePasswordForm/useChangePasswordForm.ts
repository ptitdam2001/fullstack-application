import { useState } from 'react'
import { useIntl } from 'react-intl'
import { z } from 'zod'
import { Toast } from '@repo/design-system'
import { createFormFactory } from '@repo/form-factory'
import { ChangeMyPasswordBody } from '../../domain/Account'
import { isPasswordCompliant } from '../../domain/password'
import { useChangeMyPasswordAction } from '../../application/useChangeMyPasswordAction'

// confirmPassword is a UI-only field: it is checked here and never sent to the API
const ChangePasswordFormSchema = ChangeMyPasswordBody.extend({
  newPassword: ChangeMyPasswordBody.shape.newPassword.refine(isPasswordCompliant),
  confirmPassword: z.string().min(1),
}).refine(values => values.newPassword === values.confirmPassword, { path: ['confirmPassword'] })

type ChangePasswordFormValues = z.infer<typeof ChangePasswordFormSchema>

const changePasswordFormFactory = createFormFactory({ schema: ChangePasswordFormSchema })

const EMPTY_VALUES: ChangePasswordFormValues = { currentPassword: '', newPassword: '', confirmPassword: '' }

export type ChangePasswordSubmitError = 'invalid' | 'tooManyRequests' | 'generic'

const SUBMIT_ERROR_KEYS: Record<ChangePasswordSubmitError, string> = {
  invalid: 'account.password.error.invalid',
  tooManyRequests: 'account.password.error.tooManyRequests',
  generic: 'account.password.error.generic',
}

const toSubmitError = (err: unknown): ChangePasswordSubmitError => {
  const status = (err as { response?: { status?: number } })?.response?.status
  if (status === 400) {
    return 'invalid'
  }
  if (status === 429) {
    return 'tooManyRequests'
  }
  return 'generic'
}

export const useChangePasswordForm = () => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const { process, isPending } = useChangeMyPasswordAction()
  const [submitError, setSubmitError] = useState<ChangePasswordSubmitError | null>(null)
  const { form, Field, Form } = changePasswordFormFactory.useForm({ mode: 'onBlur', defaultValues: EMPTY_VALUES })

  const onSubmit = async (values: ChangePasswordFormValues) => {
    setSubmitError(null)
    try {
      // The action swaps the session token for the fresh one before resolving
      await process(values.currentPassword, values.newPassword)
      form.reset(EMPTY_VALUES)
      toast.success(intl.formatMessage({ id: 'account.password.success' }))
    } catch (err: unknown) {
      setSubmitError(toSubmitError(err))
    }
  }

  return {
    Field,
    Form,
    onSubmit,
    isPending,
    submitError,
    submitErrorKey: submitError ? SUBMIT_ERROR_KEYS[submitError] : undefined,
  }
}
