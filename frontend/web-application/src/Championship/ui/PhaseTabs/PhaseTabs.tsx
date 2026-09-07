import { FormattedMessage } from 'react-intl'
import { Badge, Tabs, TabsList, TabsTrigger } from '@repo/design-system'
import type { Phase } from '../../domain/Phase'
import { PHASE_TYPE_MESSAGE_ID } from '../phaseTypeMessageId'

type PhaseTabsProps = {
  phases: Phase[]
  value: string
  onValueChange: (phaseId: string) => void
}

export const PhaseTabs = ({ phases, value, onValueChange }: PhaseTabsProps) => (
  <Tabs value={value} onValueChange={onValueChange}>
    <TabsList>
      {phases.map(phase => (
        <TabsTrigger key={phase.id} value={phase.id}>
          {phase.name ?? phase.order}
          <Badge variant="secondary">
            <FormattedMessage id={PHASE_TYPE_MESSAGE_ID[phase.type]} />
          </Badge>
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
)
