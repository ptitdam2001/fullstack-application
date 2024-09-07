import { Outlet } from 'react-router-dom'
import { AuthenticationProvider } from '@Authentication/context'

type Props = {
  signinPath: string
  connectedPath: string
}

export const AuthLayout = ({ connectedPath, signinPath }: Props) => (
  <AuthenticationProvider connectedMainPath={connectedPath} signinPath={signinPath}>
    <Outlet />
  </AuthenticationProvider>
)
