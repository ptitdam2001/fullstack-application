import { FormattedMessage } from 'react-intl'
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, cn } from '@repo/design-system'
import type { StandingRow } from '../../domain/Standing'
import type { TeamSummary } from '../../application/useTeamLookup'

type StandingsTableProps = {
  rows: StandingRow[]
  teams: Record<string, TeamSummary>
  qualifyRank: number
}

const formatDiff = (diff: number) => (diff > 0 ? `+${diff}` : `${diff}`)

export const StandingsTable = ({ rows, teams, qualifyRank }: StandingsTableProps) => (
  <Table>
    <TableHeader>
      <TableHead className="w-8" />
      <TableHead className="text-left">
        <FormattedMessage id="championshipDetail.standings.table.team" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="championshipDetail.standings.table.played" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="championshipDetail.standings.table.won" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="championshipDetail.standings.table.drawn" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="championshipDetail.standings.table.lost" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="championshipDetail.standings.table.goalsFor" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="championshipDetail.standings.table.goalsAgainst" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="championshipDetail.standings.table.diff" />
      </TableHead>
      <TableHead>
        <FormattedMessage id="championshipDetail.standings.table.points" />
      </TableHead>
    </TableHeader>
    <TableBody
      renderEmptyState={() => (
        <div className="text-muted-foreground py-8 text-center">
          <FormattedMessage id="championshipDetail.standings.empty" />
        </div>
      )}
    >
      {rows.map(row => {
        const qualified = row.rank <= qualifyRank
        const team = teams[row.teamId]
        return (
          <TableRow
            key={row.teamId}
            id={row.teamId}
            data-qualified={qualified}
            className={cn(qualified && 'bg-primary/5')}
          >
            <TableCell className="font-bold">{row.rank}</TableCell>
            <TableCell className="text-left font-medium">
              <div className="flex items-center gap-2">
                {team?.color && (
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: team.color }} />
                )}
                {team?.name ?? row.teamId}
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{row.played}</TableCell>
            <TableCell>{row.won}</TableCell>
            <TableCell>{row.drawn}</TableCell>
            <TableCell>{row.lost}</TableCell>
            <TableCell className="text-muted-foreground">{row.goalsFor}</TableCell>
            <TableCell className="text-muted-foreground">{row.goalsAgainst}</TableCell>
            <TableCell>{formatDiff(row.goalDifference)}</TableCell>
            <TableCell className="font-bold">{row.points}</TableCell>
          </TableRow>
        )
      })}
    </TableBody>
  </Table>
)
