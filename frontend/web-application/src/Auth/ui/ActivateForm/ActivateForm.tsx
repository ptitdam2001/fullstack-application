import { Link, useSearchParams } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Button, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { LOGIN_PAGE } from '../../domain/Auth'
import { useActivateAction } from '../../application/useActivateAction'

export const ActivateForm = () => {
  const toast = Toast.useToast()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const { process, isPending, isSuccess, isError } = useActivateAction()

  const handleActivate = () => {
    process(token).catch(() => {
      toast('activate.error.invalid')
    })
  }

  if (!token) {
    return (
      <p className="font-medium text-red-600">
        <FormattedMessage id="activate.error.invalid" />
      </p>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-green-600">
          <FormattedMessage id="activate.success.title" />
        </h2>
        <p className="text-slate-600">
          <FormattedMessage id="activate.success.description" />
        </p>
        <Link to={LOGIN_PAGE}>
          <Button className="w-full max-w-sm">
            <FormattedMessage id="activate.success.cta" />
          </Button>
        </Link>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-medium text-red-600">
          <FormattedMessage id="activate.error.invalid" />
        </p>
        <Link to={LOGIN_PAGE} className="text-sm text-blue-600 hover:underline">
          <FormattedMessage id="activate.error.resend" />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold">
        <FormattedMessage id="activate.title" />
      </h2>
      <p className="text-slate-500">
        <FormattedMessage id="activate.description" />
      </p>
      <Button onPress={handleActivate} isDisabled={isPending} className="w-full max-w-sm">
        {isPending && <Loader2 className="animate-spin" />}
        <FormattedMessage id="activate.submit" />
      </Button>
    </div>
  )
}
