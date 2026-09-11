import { FormattedMessage } from 'react-intl'
import { BracketConnectors } from '../../BracketConnectors/BracketConnectors'
import { BracketMatchCard } from './BracketMatchCard'
import type { Match } from '../../../domain/Match'
import type { BracketConnector } from '../../../application/buildBracket'

type Props = {
  rounds: Match[][]
  connectors: BracketConnector[]
}

const COL_W = 176
const COL_GAP = 44
const MATCH_H = 70
const LEAF_GAP = 16
const LABEL_H = 22

const roundLabelId = (index: number, total: number): string => {
  const remaining = total - index
  if (remaining === 1) {
    return 'championshipDetail.knockout.round.final'
  }
  if (remaining === 2) {
    return 'championshipDetail.knockout.round.semiFinal'
  }
  if (remaining === 3) {
    return 'championshipDetail.knockout.round.quarterFinal'
  }
  return 'championshipDetail.knockout.round.n'
}

export const BracketGrid = ({ rounds, connectors }: Props) => {
  const leafCount = rounds[0]?.length ?? 0
  const height = leafCount ? leafCount * MATCH_H + (leafCount - 1) * LEAF_GAP : MATCH_H
  const width = rounds.length * COL_W + (rounds.length - 1) * COL_GAP
  const centerY = (roundIndex: number, matchIndex: number) => (height * (matchIndex + 0.5)) / rounds[roundIndex].length
  const xLeft = (roundIndex: number) => roundIndex * (COL_W + COL_GAP)

  return (
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
            <FormattedMessage id={roundLabelId(roundIndex, rounds.length)} values={{ number: roundIndex + 1 }} />
          </div>
          {round.map((match, matchIndex) => (
            <BracketMatchCard
              key={match.id}
              match={match}
              style={{
                left: xLeft(roundIndex),
                top: centerY(roundIndex, matchIndex) - MATCH_H / 2,
                width: COL_W,
                height: MATCH_H,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
