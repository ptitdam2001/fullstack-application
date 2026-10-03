import { FormattedMessage } from 'react-intl'
import { AuthProvider } from '../application/AuthProvider'
import { AccountPhoto } from '../ui/AccountPhoto/AccountPhoto'
import { AccountProfileForm } from '../ui/AccountProfileForm/AccountProfileForm'
import { ChangePasswordForm } from '../ui/ChangePasswordForm/ChangePasswordForm'

export const MyProfile = () => {
  const { user } = AuthProvider.useAuthValue()

  if (!user) {
    return null
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6 lg:max-w-5xl xl:max-w-7xl">
      <h1 className="text-foreground text-2xl font-bold">
        <FormattedMessage id="settings.account" />
      </h1>
      {/*
        Keeps the page above the fold on desktop:
        - lg: forms stacked on the left, photo on the right
        - xl: one column per section (the wrapper dissolves so the three cards become grid items)
      */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 xl:contents">
          <AccountProfileForm user={user} />
          <ChangePasswordForm />
        </div>
        <AccountPhoto user={user} />
      </div>
    </div>
  )
}
