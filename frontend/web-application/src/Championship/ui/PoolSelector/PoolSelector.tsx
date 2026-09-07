import { Tabs, TabsList, TabsTrigger } from '@repo/design-system'
import type { Group } from '../../domain/Group'

type PoolSelectorProps = {
  pools: Group[]
  value: string
  onValueChange: (poolId: string) => void
}

export const PoolSelector = ({ pools, value, onValueChange }: PoolSelectorProps) => {
  if (pools.length <= 1) {
    return null
  }

  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList>
        {pools.map(pool => (
          <TabsTrigger key={pool.id} value={pool.id}>
            {pool.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
