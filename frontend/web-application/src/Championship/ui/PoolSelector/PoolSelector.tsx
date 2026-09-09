import { useIntl } from 'react-intl'
import { Tab, Tabs, TabList } from '@repo/design-system'
import type { Group } from '../../domain/Group'

type PoolSelectorProps = {
  pools: Group[]
  value: string
  onValueChange: (poolId: string) => void
}

export const PoolSelector = ({ pools, value, onValueChange }: PoolSelectorProps) => {
  const intl = useIntl()

  if (pools.length <= 1) {
    return null
  }

  return (
    <Tabs selectedKey={value} onSelectionChange={key => onValueChange(key as string)}>
      <TabList aria-label={intl.formatMessage({ id: 'championshipDetail.standings.poolSelector' })}>
        {pools.map(pool => (
          <Tab key={pool.id} id={pool.id}>
            {pool.name}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  )
}
