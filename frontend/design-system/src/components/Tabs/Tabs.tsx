import * as React from 'react'
import { Tabs as AriaTabs } from 'react-aria-components'

import { cn } from '../../utils/cn'

type TabsProps = Omit<React.ComponentProps<typeof AriaTabs>, 'selectedKey' | 'defaultSelectedKey' | 'onSelectionChange'> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  role?: string
}

function Tabs({ className, value, defaultValue, onValueChange, role: _role, ...props }: TabsProps) {
  return (
    <AriaTabs
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      selectedKey={value}
      defaultSelectedKey={defaultValue}
      onSelectionChange={(key) => onValueChange?.(key as string)}
      {...props}
    />
  )
}

export { Tabs }
