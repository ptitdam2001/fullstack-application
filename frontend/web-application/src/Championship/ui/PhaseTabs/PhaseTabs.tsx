import { FormattedMessage, useIntl } from 'react-intl'
import { Badge, Tab, Tabs, TabList } from '@repo/design-system'
import type { Phase } from '../../domain/Phase'
import { PHASE_TYPE_MESSAGE_ID } from '../phaseTypeMessageId'

type PhaseTabsProps = {
  phases: Phase[]
  value: string
  onValueChange: (phaseId: string) => void
}

export const PhaseTabs = ({ phases, value, onValueChange }: PhaseTabsProps) => {
  const intl = useIntl()

  return (
    <Tabs selectedKey={value} onSelectionChange={key => onValueChange(key as string)}>
      <TabList aria-label={intl.formatMessage({ id: 'championshipDetail.phases.selector' })}>
        {phases.map(phase => (
          <Tab key={phase.id} id={phase.id}>
            {phase.name ?? phase.order}
            <Badge variant="secondary">
              <FormattedMessage id={PHASE_TYPE_MESSAGE_ID[phase.type]} />
            </Badge>
          </Tab>
        ))}
      </TabList>
    </Tabs>
  )
}
