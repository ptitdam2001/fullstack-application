import { FormattedMessage } from 'react-intl'
import { AuthProvider } from '../application/AuthProvider'

export const MyProfile = () => {
  const { user } = AuthProvider.useAuthValue()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        <FormattedMessage id="settings.account" />
      </h1>
      {user && (
        <div className="mt-4 space-y-1 text-sm text-slate-600">
          <p>{user.firstName} {user.lastName}</p>
          <p>{user.email}</p>
        </div>
      )}
    </div>
  )
}
