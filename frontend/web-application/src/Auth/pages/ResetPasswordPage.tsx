import { Layout } from '@repo/design-system'
import { ResetPasswordForm } from '../ui/ResetPasswordForm/ResetPasswordForm'

export const ResetPasswordPage = () => (
  <Layout.Root>
    <Layout.Content align="center">
      <div className="w-full max-w-sm py-8">
        <ResetPasswordForm />
      </div>
    </Layout.Content>
  </Layout.Root>
)
