import { FormattedMessage } from 'react-intl'
import { Card } from '@repo/design-system'
import { useKnockoutBracket } from './useKnockoutBracket'
import { BracketGrid } from './components/BracketGrid'
import type { Match } from '../../domain/Match'

type Props = {
  matches: Match[]
}

export const KnockoutBracket = ({ matches }: Props) => {
  const { rounds, connectors, hasBracket } = useKnockoutBracket(matches)

  return (
    <Card.Container>
      <Card.Content className="bg-secondary px-3 py-2">
        <Card.Title className="text-sm">
          <FormattedMessage id="championshipDetail.knockout.title" />
        </Card.Title>
      </Card.Content>
      {hasBracket ? (
        <Card.Content className="overflow-x-auto pb-3">
          <BracketGrid rounds={rounds} connectors={connectors} />
        </Card.Content>
      ) : (
        <Card.Content className="text-muted-foreground py-16 text-center text-sm">
          <FormattedMessage id="championshipDetail.knockout.empty" />
        </Card.Content>
      )}
    </Card.Container>
  )
}
