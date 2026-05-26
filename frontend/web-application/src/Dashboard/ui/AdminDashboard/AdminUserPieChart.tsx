import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { FormattedMessage, useIntl } from 'react-intl'
import type { RoleDistributionEntry } from '@Dashboard/domain/Dashboard'

type Props = { distribution: RoleDistributionEntry[] }

export const AdminUserPieChart = ({ distribution }: Props) => {
  const { formatMessage } = useIntl()

  const localizedData = distribution.map(entry => ({
    ...entry,
    name: formatMessage({
      id: `adminDashboard.chart.role.${entry.role.toLowerCase().replace(' ', '')}`,
      defaultMessage: entry.role,
    }),
  }))

  return (
    <div className="bg-card rounded-lg border p-4">
      <h3 className="mb-3 text-sm font-semibold">
        <FormattedMessage id="adminDashboard.chart.title" />
      </h3>
      {distribution.length === 0 ? (
        <div className="text-muted-foreground flex h-48 items-center justify-center text-sm">—</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={localizedData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {localizedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [value, 'coucou']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
