import { Typography, Breadcrumbs as MuiBreadcrumbs } from '@mui/material'
import Link, { LinkProps } from '@mui/material/Link'

import { Link as RouterLink, useLocation } from 'react-router-dom'

type LinkRouterProps = LinkProps & {
  to: string
  replace?: boolean
}

const LinkRouter: React.FC<LinkRouterProps> = props => <Link {...props} component={RouterLink} />

export const Breadcrumbs = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      <LinkRouter underline="hover" color="inherit" to="/app">
        Home
      </LinkRouter>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1
        const to = `/${pathnames.slice(0, index + 1).join('/')}`

        if (value === 'app') {
          return null
        }

        return last ? (
          <Typography key={to} sx={{ color: 'text.primary' }}>
            {value}
          </Typography>
        ) : (
          <LinkRouter underline="hover" color="inherit" to={to} key={to}>
            {value}
          </LinkRouter>
        )
      })}
    </MuiBreadcrumbs>
  )
}
