import { useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Typography, cn } from '@repo/design-system'
import type { Team } from '@Teams/domain/Team'
import type { ChampionshipWizardGroup } from '../../application/useChampionshipWizard'

type StepTeamsGroupsProps = {
  teams: Team[]
  groups: ChampionshipWizardGroup[]
  onAddGroup: () => void
  onRemoveGroup: (groupId: string) => void
  onRenameGroup: (groupId: string, name: string) => void
  onAssignTeam: (teamId: string, groupId: string | null) => void
}

type DropZone = 'available' | string

const TeamItem = ({
  team,
  draggable,
  onDragStart,
  onDragEnd,
  action,
}: {
  team: Team
  draggable: boolean
  onDragStart: () => void
  onDragEnd: () => void
  action: React.ReactNode
}) => (
  <div
    draggable={draggable}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    className="border-border bg-card flex items-center gap-2.5 rounded-md border p-2 text-sm"
  >
    <span
      className="border-border h-3 w-3 shrink-0 rounded-full border"
      style={{ background: team.color ?? undefined }}
    />
    <span className="flex-1 font-medium">{team.name}</span>
    {action}
  </div>
)

export const StepTeamsGroups = ({
  teams,
  groups,
  onAddGroup,
  onRemoveGroup,
  onRenameGroup,
  onAssignTeam,
}: StepTeamsGroupsProps) => {
  const intl = useIntl()
  const [dragId, setDragId] = useState<string | null>(null)
  const [overZone, setOverZone] = useState<DropZone | null>(null)
  const [menuFor, setMenuFor] = useState<string | null>(null)

  const assignedIds = useMemo(() => new Set(groups.flatMap(g => g.teamIds)), [groups])
  const available = teams.filter(t => !assignedIds.has(t.id))

  const handleDrop = (targetGroupId: string | null) => {
    if (dragId) {
      onAssignTeam(dragId, targetGroupId)
    }
    setDragId(null)
    setOverZone(null)
  }

  return (
    <div>
      <Typography.Title2>
        <FormattedMessage id="championshipWizard.step.teamsGroups" />
      </Typography.Title2>
      <Typography.Body className="text-muted-foreground mb-5">
        <FormattedMessage id="championshipWizard.step.teamsGroups.hint" />
      </Typography.Body>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[220px_1fr]">
        <div className="border-border bg-secondary flex min-h-70 flex-col rounded-lg border">
          <div className="border-border flex items-center justify-between border-b px-3 py-2">
            <span className="text-sm font-semibold">
              <FormattedMessage id="championshipWizard.step.teamsGroups.availableTitle" />
            </span>
            <span className="text-muted-foreground text-xs">{available.length}</span>
          </div>
          <div
            data-testid="available-body"
            className={cn(
              'flex flex-1 flex-col gap-1.5 p-2 transition-colors',
              overZone === 'available' && 'bg-primary/10'
            )}
            onDragOver={e => {
              e.preventDefault()
              setOverZone('available')
            }}
            onDragLeave={() => setOverZone(null)}
            onDrop={e => {
              e.preventDefault()
              handleDrop(null)
            }}
          >
            {available.length === 0 ? (
              <div className="text-muted-foreground border-border flex flex-1 items-center justify-center rounded-md border border-dashed p-4 text-center text-xs">
                <FormattedMessage id="championshipWizard.step.teamsGroups.availableEmpty" />
              </div>
            ) : (
              available.map(team => (
                <div key={team.id} className="relative">
                  <TeamItem
                    team={team}
                    draggable
                    onDragStart={() => setDragId(team.id)}
                    onDragEnd={() => {
                      setDragId(null)
                      setOverZone(null)
                    }}
                    action={
                      <button
                        type="button"
                        aria-label={intl.formatMessage({ id: 'championshipWizard.step.teamsGroups.assignTo' })}
                        onClick={() => setMenuFor(menuFor === team.id ? null : team.id)}
                        className="border-border hover:bg-secondary h-6 w-6 shrink-0 rounded border text-xs"
                      >
                        →
                      </button>
                    }
                  />
                  {menuFor === team.id && (
                    <div className="border-border bg-card absolute top-full right-0 z-10 mt-1 min-w-35 overflow-hidden rounded-md border shadow-lg">
                      {groups.map(g => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            onAssignTeam(team.id, g.id)
                            setMenuFor(null)
                          }}
                          className="hover:bg-secondary block w-full px-3 py-1.5 text-left text-xs"
                        >
                          {g.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-3.5">
          {groups.map(group => {
            const groupTeams = group.teamIds.map(id => teams.find(t => t.id === id)).filter((t): t is Team => !!t)
            const warn = groupTeams.length < 2
            return (
              <div key={group.id} className="border-border bg-secondary flex w-55 flex-col rounded-lg border">
                <div className="border-border flex items-center gap-1.5 border-b p-2">
                  <input
                    aria-label={intl.formatMessage({ id: 'championshipWizard.step.teamsGroups.groupNameLabel' })}
                    value={group.name}
                    onChange={e => onRenameGroup(group.id, e.target.value)}
                    className="focus:bg-background min-w-0 flex-1 rounded bg-transparent px-1 py-0.5 text-sm font-semibold outline-none"
                  />
                  <button
                    type="button"
                    aria-label={intl.formatMessage({ id: 'championshipWizard.step.teamsGroups.removeGroup' })}
                    disabled={groups.length <= 1}
                    onClick={() => onRemoveGroup(group.id)}
                    className="border-border bg-background text-muted-foreground hover:text-destructive h-6 w-6 shrink-0 rounded border text-xs disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ✕
                  </button>
                </div>
                <div
                  data-testid={`group-body-${group.id}`}
                  className={cn(
                    'flex min-h-30 flex-1 flex-col gap-1.5 p-2 transition-colors',
                    overZone === group.id && 'bg-primary/10'
                  )}
                  onDragOver={e => {
                    e.preventDefault()
                    setOverZone(group.id)
                  }}
                  onDragLeave={() => setOverZone(null)}
                  onDrop={e => {
                    e.preventDefault()
                    handleDrop(group.id)
                  }}
                >
                  {groupTeams.length === 0 ? (
                    <div className="text-muted-foreground border-border flex flex-1 items-center justify-center rounded-md border border-dashed p-3 text-center text-xs">
                      <FormattedMessage id="championshipWizard.step.teamsGroups.dropHere" />
                    </div>
                  ) : (
                    groupTeams.map(team => (
                      <TeamItem
                        key={team.id}
                        team={team}
                        draggable
                        onDragStart={() => setDragId(team.id)}
                        onDragEnd={() => {
                          setDragId(null)
                          setOverZone(null)
                        }}
                        action={
                          <button
                            type="button"
                            aria-label={intl.formatMessage({ id: 'championshipWizard.step.teamsGroups.unassign' })}
                            onClick={() => onAssignTeam(team.id, null)}
                            className="border-border hover:bg-secondary h-6 w-6 shrink-0 rounded border text-xs"
                          >
                            ←
                          </button>
                        }
                      />
                    ))
                  )}
                </div>
                <div className={cn('border-border border-t px-3 py-1.5 text-xs', warn && 'text-destructive')}>
                  {warn ? (
                    <FormattedMessage
                      id="championshipWizard.step.teamsGroups.teamCountWarn"
                      values={{ count: groupTeams.length }}
                    />
                  ) : (
                    <FormattedMessage
                      id="championshipWizard.step.teamsGroups.teamCount"
                      values={{ count: groupTeams.length }}
                    />
                  )}
                </div>
              </div>
            )
          })}
          <button
            type="button"
            onClick={onAddGroup}
            className="border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 flex min-h-70 w-55 items-center justify-center rounded-lg border border-dashed text-sm font-medium"
          >
            <FormattedMessage id="championshipWizard.step.teamsGroups.addGroup" />
          </button>
        </div>
      </div>
    </div>
  )
}
