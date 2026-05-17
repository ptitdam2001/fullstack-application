import { Layout } from '@repo/design-system'
import { ActivateForm } from '../ui/ActivateForm/ActivateForm'

export const ActivatePage = () => (
  <Layout.Root>
    <Layout.Content align="center">
      <div className="w-full max-w-sm py-8">
        <ActivateForm />
      </div>
    </Layout.Content>
  </Layout.Root>
)
