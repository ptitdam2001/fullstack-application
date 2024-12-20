import { Button, ButtonProps } from '@mui/material'
import { useAuthContext } from './AuthProvider'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Link } from 'react-router-dom'
import { LOGOUT_PAGE } from './constant'

type AuthActionsProps = Pick<ButtonProps, 'color' | 'size'>

export const AuthActions = ({ color = 'primary', size = 'medium' }: AuthActionsProps) => {
  const { user } = useAuthContext()

  return user ? (
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
