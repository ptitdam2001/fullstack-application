import { Users, CalendarDays, Trophy, TrendingUp } from 'lucide-react'
import type { CoachDashboardStats } from '@Dashboard/domain/Dashboard'

type StatCardProps = {
  icon: React.ReactNode
  label: string
  value: number | string
}

const StatCard = ({ icon, label, value }: StatCardProps) => (
  <div className="bg-card flex flex-col gap-2 rounded-lg border p-4">
    <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
      {icon}
      {label}
    </div>
    <div className="text-2xl font-semibold tracking-tight">{value}</div>
  </div>
)

type Props = {
  stats: CoachDashboardStats
}

export const CoachKpiCards = ({ stats }: Props) => (
  <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
    <StatCard icon={<Users className="h-4 w-4" />} label="Mes équipes" value={stats.teamCount} />
    <StatCard icon={<CalendarDays className="h-4 w-4" />} label="Matchs à venir" value={stats.upcomingMatchCount} />
    <StatCard icon={<Trophy className="h-4 w-4" />} label="Championnats" value="—" />
    <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Victoires" value="—" />
  </div>
)