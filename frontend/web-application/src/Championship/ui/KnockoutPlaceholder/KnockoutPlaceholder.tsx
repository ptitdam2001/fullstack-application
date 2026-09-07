import { FormattedMessage } from 'react-intl'
import { Card } from '@repo/design-system'

export const KnockoutPlaceholder = () => (
  <Card.Container>
    <Card.Content className="bg-secondary px-3 py-2">
      <Card.Title className="text-sm">
        <FormattedMessage id="championshipDetail.knockout.title" />
      </Card.Title>
    </Card.Content>
    <Card.Content className="text-muted-foreground py-16 text-center text-sm">
      <FormattedMessage id="championshipDetail.knockout.placeholder" />
    </Card.Content>
  </Card.Container>
)
