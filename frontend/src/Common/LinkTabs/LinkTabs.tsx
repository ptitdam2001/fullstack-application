import React from 'react'
import { TabContext } from './TabsContext'
import { Tabs } from '@/components/ui/tabs'
import { TabsProps } from '@radix-ui/react-tabs'

type LinkTabsProps = React.PropsWithChildren<{
  name?: string
  defaultValue?: string
}> &
  Pick<TabsProps, 'onChange'>

export const LinkTabs: React.FC<LinkTabsProps> = ({ name, defaultValue, onChange, children }) => (
  <TabContext.Provider value={{ currentValue: defaultValue }}>
    <Tabs defaultValue={defaultValue} onChange={onChange} aria-label={name ?? 'link tabs'} role="navigation">
      {children}
    </Tabs>
  </TabContext.Provider>
)
