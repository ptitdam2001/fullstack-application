import { FormattedMessage } from 'react-intl'
import { Typography } from '@repo/design-system'
import type { Team } from '@Teams/domain/Team'
import { buildBracket } from '../../application/buildBracket'
import { BracketConnectors } from './components/BracketConnectors'

type StepConfigKnockoutProps = {
  teams: Team[]
  teamIds: string[]
}

const COL_W = 176
const COL_GAP = 44
const MATCH_H = 60
const LEAF_GAP = 16
const LABEL_H = 22

const roundLabelId = (index: number, total: number): string => {
  const remaining = total - index
  if (remaining === 1) {
    return 'championshipWizard.step.configKnockout.round.final'
  }
  if (remaining === 2) {
    return 'championshipWizard.step.configKnockout.round.semiFinal'
  }
  if (remaining === 3) {
    return 'championshipWizard.step.configKnockout.round.quarterFinal'
  }
  return 'championshipWizard.step.configKnockout.round.n'
}

export const StepConfigKnockout = ({ teams, teamIds }: StepConfigKnockoutProps) => {
  const teamName = (id: string | null) => (id ? teams.find(t => t.id === id)?.name : undefined)
  const { rounds, connectors } = buildBracket(teamIds)

  const leafCount = rounds.length ? rounds[0].length : 0
  const height = leafCount ? leafCount * MATCH_H + (leafCount - 1) * LEAF_GAP : MATCH_H
  const width = rounds.length ? rounds.length * COL_W + (rounds.length - 1) * COL_GAP : COL_W
  const centerY = (roundIndex: number, matchIndex: number) =>
    (height * (matchIndex + 0.5)) / rounds[roundIndex].length
  const xLeft = (roundIndex: number) => roundIndex * (COL_W + COL_GAP)

  return (
    <div>
      <Typography.Title2>
        <FormattedMessage id="championshipWizard.step.configKnockout" />
      </Typography.Title2>
      <Typography.Body className="text-muted-foreground mb-5">
        <FormattedMessage id="championshipWizard.step.configKnockout.hint" />
      </Typography.Body>

      <Typography.Title3 className="mb-2.5">
        <FormattedMessage id="championshipWizard.step.configKnockout.bracketTitle" />
      </Typography.Title3>

      {teamIds.length < 2 ? (
        <div className="border-border text-muted-foreground rounded-md border p-6 text-center text-sm">
          <FormattedMessage id="championshipWizard.step.configKnockout.empty" />
        </div>
      ) : (
        <div className="overflow-x-auto pb-3">
          <div className="relative" style={{ width, height: height + LABEL_H + 8, marginTop: LABEL_H + 8 }}>
            <BracketConnectors
              connectors={connectors}
              width={width}
              height={height}
              colW={COL_W}
              xLeft={xLeft}
              centerY={centerY}
            />
            {rounds.map((round, roundIndex) => (
              <div key={roundIndex}>
                <div
                  className="text-muted-foreground absolute text-center text-[11px] font-semibold tracking-wide uppercase"
                  style={{ left: xLeft(roundIndex), top: -LABEL_H, width: COL_W }}
                >
                  <FormattedMessage
                    id={roundLabelId(roundIndex, rounds.length)}
                    values={{ number: roundIndex + 1 }}
                  />
                </div>
                {round.map((match, matchIndex) => {
                  const aName = teamName(match.a.teamId)
                  const isBye = match.b === null
                  const bName = isBye ? undefined : teamName(match.b?.teamId ?? null)
                  return (
                    <div
                      key={matchIndex}
                      className="border-border absolute overflow-hidden rounded-md border"
                      style={{
                        left: xLeft(roundIndex),
                        top: centerY(roundIndex, matchIndex) - MATCH_H / 2,
                        width: COL_W,
                        height: MATCH_H,
                      }}
                    >
                      <div className="border-border flex items-center justify-between gap-1.5 border-b px-2.5 py-2 text-xs font-medium">
                        <span className={aName ? undefined : 'text-muted-foreground font-normal'}>
                          {aName ?? <FormattedMessage id="championshipWizard.step.configKnockout.tbd" />}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1.5 px-2.5 py-2 text-xs font-medium">
                        {isBye ? (
                          <>
                            <span className="text-muted-foreground font-normal italic">
                              <FormattedMessage id="championshipWizard.step.configKnockout.bye" />
                            </span>
                            <span className="bg-secondary text-muted-foreground rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase">
                              <FormattedMessage id="championshipWizard.step.configKnockout.byeBadge" />
                            </span>
                          </>
                        ) : (
                          <span className={bName ? undefined : 'text-muted-foreground font-normal'}>
                            {bName ?? <FormattedMessage id="championshipWizard.step.configKnockout.tbd" />}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
