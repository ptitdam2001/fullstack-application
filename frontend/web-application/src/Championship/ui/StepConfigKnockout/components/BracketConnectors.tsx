import { type BracketConnector } from '../../../application/buildBracket'

type BracketConnectorsProps = {
  connectors: BracketConnector[]
  width: number
  height: number
  colW: number
  xLeft: (roundIndex: number) => number
  centerY: (roundIndex: number, matchIndex: number) => number
}

export const BracketConnectors = ({ connectors, width, height, colW, xLeft, centerY }: BracketConnectorsProps) => (
  <svg width={width} height={height} className="absolute top-0 left-0 overflow-visible">
    {connectors.map((c, i) => {
      const x1 = xLeft(c.fromRound) + colW
      const y1 = centerY(c.fromRound, c.fromMatch)
      const x2 = xLeft(c.toRound)
      const y2 = centerY(c.toRound, c.toMatch)
      const xMid = (x1 + x2) / 2
      return (
        <path key={i} d={`M${x1} ${y1} H${xMid} V${y2} H${x2}`} fill="none" className="stroke-border" strokeWidth={1.5} />
      )
    })}
  </svg>
)
