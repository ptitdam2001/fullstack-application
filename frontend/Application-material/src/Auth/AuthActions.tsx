import { Button, ButtonProps } from '@mui/material'
import { AuthProvider } from './AuthProvider'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Link } from 'react-router'
import { LOGOUT_PAGE } from './constant'

type AuthActionsProps = Pick<ButtonProps, 'color' | 'size'>

export const AuthActions = ({ color = 'primary', size = 'medium' }: AuthActionsProps) => {
  const { token } = AuthProvider.useAuthValue()

  return token ? (
    <Button
      variant="outlined"
      startIcon={<AccountCircleIcon />}
      component={Link}
      to={LOGOUT_PAGE}
      color={color}
      size={size}
    >
      Logout
    </Button>
  ) : null
}
