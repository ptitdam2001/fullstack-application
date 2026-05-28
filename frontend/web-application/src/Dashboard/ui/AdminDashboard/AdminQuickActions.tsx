import { Link } from 'react-router'
import { Users, Shield, CalendarDays } from 'lucide-react'
import { useIntl } from 'react-intl'

export const AdminQuickActions = () => {
  const { formatMessage } = useIntl()

  const actions = [
    { labelId: 'adminDashboard.actions.teams', href: '/app/admin/teams', icon: <Shield className="h-4 w-4" /> },
    { labelId: 'adminDashboard.actions.users', href: '/app/admin/users', icon: <Users className="h-4 w-4" /> },
    { labelId: 'adminDashboard.actions.games', href: '/app/games', icon: <CalendarDays className="h-4 w-4" /> },
  ]

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {actions.map(({ labelId, href, icon }) => (
        <Link
          key={href}
          to={href}
          className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
        >
          {icon}
          {formatMessage({ id: labelId })}
        </Link>
      ))}
    </div>
  )
}
