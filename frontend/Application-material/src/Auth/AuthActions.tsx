import { Button, ButtonProps } from '@mui/material'
import { Auth } from './Auth'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Link } from 'react-router-dom'
import { LOGOUT_PAGE } from './constant'

type AuthActionsProps = Pick<ButtonProps, 'color' | 'size'>

export const AuthActions = ({ color = 'primary', size = 'medium' }: AuthActionsProps) => {
  const { user } = Auth.useAuthValue()

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
