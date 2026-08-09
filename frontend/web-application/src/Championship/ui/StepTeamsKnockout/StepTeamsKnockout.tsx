import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Typography, cn } from '@repo/design-system'
import type { Team } from '@Teams/domain/Team'

type StepTeamsKnockoutProps = {
  teams: Team[]
  teamIds: string[]
  onToggleTeam: (teamId: string) => void
}

type Column = 'available' | 'selected'

export const StepTeamsKnockout = ({ teams, teamIds, onToggleTeam }: StepTeamsKnockoutProps) => {
  const intl = useIntl()
  const [dragId, setDragId] = useState<string | null>(null)
  const [overCol, setOverCol] = useState<Column | null>(null)

  const selected = teamIds.map(id => teams.find(t => t.id === id)).filter((t): t is Team => !!t)
  const available = teams.filter(t => !teamIds.includes(t.id))
  const count = selected.length
  const warn = count < 2

  const handleDrop = (targetSelected: boolean) => {
    if (dragId) {
      const isSelected = teamIds.includes(dragId)
      if (isSelected !== targetSelected) {
        onToggleTeam(dragId)
      }
    }
    setDragId(null)
    setOverCol(null)
  }

  const renderColumn = (column: Column, items: Team[], isSelected: boolean) => (
    <div className="border-border bg-secondary flex min-h-[280px] flex-col rounded-lg border">
      <div className="border-border flex items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-semibold">
          <FormattedMessage
            id={isSelected ? 'championshipWizard.step.teamsKnockout.selectedTitle' : 'championshipWizard.step.teamsKnockout.availableTitle'}
          />
        </span>
        <span className="text-muted-foreground text-xs">{items.length}</span>
      </div>
      <div
        data-testid={`knockout-${column}-body`}
        className={cn(
          'flex flex-1 flex-col gap-1.5 p-2 transition-colors',
          overCol === column && 'bg-primary/10'
        )}
        onDragOver={e => {
          e.preventDefault()
          setOverCol(column)
        }}
        onDragLeave={() => setOverCol(null)}
        onDrop={e => {
          e.preventDefault()
          handleDrop(isSelected)
        }}
      >
        {items.length === 0 ? (
          <div className="text-muted-foreground border-border flex flex-1 items-center justify-center rounded-md border border-dashed p-4 text-center text-xs">
            <FormattedMessage
              id={
                isSelected
                  ? 'championshipWizard.step.teamsKnockout.selectedEmpty'
                  : 'championshipWizard.step.teamsKnockout.availableEmpty'
              }
            />
          </div>
        ) : (
          items.map(team => (
            <div
              key={team.id}
              draggable
              onDragStart={() => setDragId(team.id)}
              onDragEnd={() => {
                setDragId(null)
                setOverCol(null)
              }}
              className="border-border bg-card flex items-center gap-2.5 rounded-md border p-2 text-sm"
            >
              <span
                className="border-border h-3 w-3 shrink-0 rounded-full border"
                style={{ background: team.color ?? undefined }}
              />
              <span className="flex-1 font-medium">{team.name}</span>
              <button
                type="button"
                aria-label={intl.formatMessage({
                  id: isSelected ? 'championshipWizard.step.teamsKnockout.remove' : 'championshipWizard.step.teamsKnockout.add',
                })}
                onClick={() => onToggleTeam(team.id)}
                className="border-border hover:bg-secondary h-6 w-6 shrink-0 rounded border text-xs"
              >
                {isSelected ? '←' : '→'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div>
      <Typography.Title2>
        <FormattedMessage id="championshipWizard.step.teamsKnockout" />
      </Typography.Title2>
      <Typography.Body className="text-muted-foreground mb-5">
        <FormattedMessage id="championshipWizard.step.teamsKnockout.hint" />
      </Typography.Body>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {renderColumn('available', available, false)}
        {renderColumn('selected', selected, true)}
      </div>

      <div className={cn('mt-2 text-xs', warn && 'text-destructive')}>
        {warn ? (
          <FormattedMessage id="championshipWizard.step.teamsKnockout.countWarn" values={{ count }} />
        ) : (
          <FormattedMessage id="championshipWizard.step.teamsKnockout.count" values={{ count }} />
        )}
      </div>
    </div>
  )
}
