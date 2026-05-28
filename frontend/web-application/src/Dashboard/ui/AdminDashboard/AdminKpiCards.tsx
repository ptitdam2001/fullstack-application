import { AlertCircle, Clock, Trophy, Users } from 'lucide-react'
import { Link } from 'react-router'
import { useIntl } from 'react-intl'
import { cn } from '@repo/design-system'

type KpiCardProps = {
  icon: React.ReactNode
  label: string
  value: number
  href: string
  highlight?: boolean
}

const KpiCard = ({ icon, label, value, href, highlight }: KpiCardProps) => (
  <Link
    to={href}
    className={cn(`bg-card hover:bg-accent flex flex-col gap-2 rounded-lg border p-4 transition-colors`, {
      'border-destructive/40': highlight && value > 0,
    })}
  >
    <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
      {icon}
      {label}
    </div>
    <div className={cn(`text-2xl font-semibold tracking-tight`, { 'text-destructive': highlight && value > 0 })}>
      {value}
    </div>
  </Link>
)

type Props = {
  pendingScoreCount: number
  pendingActivationCount: number
  championshipCount: number
  teamCount: number
}

export const AdminKpiCards = ({ pendingScoreCount, pendingActivationCount, championshipCount, teamCount }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <KpiCard
        icon={<Clock className="h-4 w-4" />}
        label={formatMessage({ id: 'adminDashboard.kpi.pendingScore' })}
        value={pendingScoreCount}
        href="/app/games"
        highlight
      />
      <KpiCard
        icon={<AlertCircle className="h-4 w-4" />}
        label={formatMessage({ id: 'adminDashboard.kpi.pendingActivation' })}
        value={pendingActivationCount}
        href="/app/admin/users"
        highlight
      />
      <KpiCard
        icon={<Trophy className="h-4 w-4" />}
        label={formatMessage({ id: 'adminDashboard.kpi.championships' })}
        value={championshipCount}
        href="/app/admin/championships"
      />
      <KpiCard
        icon={<Users className="h-4 w-4" />}
        label={formatMessage({ id: 'adminDashboard.kpi.teams' })}
        value={teamCount}
        href="/app/admin/teams"
      />
    </div>
  )
}
