import { LoginForbiddenReason } from '@Sdk/model'
import { getHttpStatus } from './httpError'

/**
 * i18n key of a failed sign-in. A 403 is read by its `reason` code (schema LoginForbidden), never by its
 * message: the message is French text written by the API and may change.
 */
export const getSigninErrorKey = (err: unknown): string => {
  const status = getHttpStatus(err)
  if (status === 429) {
    return 'auth.error.tooManyRequests'
  }
  if (status === 403) {
    const reason = (err as { response?: { data?: { reason?: unknown } } }).response?.data?.reason
    return reason === LoginForbiddenReason.ACCOUNT_INACTIVE ? 'auth.error.accountInactive' : 'auth.error.accountBlocked'
  }
  return 'auth.error.invalidCredentials'
}
