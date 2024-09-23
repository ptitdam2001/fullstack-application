import { Button } from '@mui/material'
import { useAuthContext } from './AuthProvider'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { Link } from 'react-router-dom'
import { LOGOUT_PAGE } from './constant'

export const AuthActions = () => {
  const { user } = useAuthContext()

  return user ? (
    <Button variant="outlined" startIcon={<AccountCircleIcon />} component={Link} to={LOGOUT_PAGE}>
      Logout
    </Button>
  ) : null
}
