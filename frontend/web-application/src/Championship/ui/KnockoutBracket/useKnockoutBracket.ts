import { useMemo } from 'react'
import { buildBracketFromMatches } from '../../application/buildBracketFromMatches'
import type { Match } from '../../domain/Match'

export const useKnockoutBracket = (matches: Match[]) => {
  const { rounds, connectors } = useMemo(() => buildBracketFromMatches(matches), [matches])
  return { rounds, connectors, hasBracket: rounds.length > 0 }
}
