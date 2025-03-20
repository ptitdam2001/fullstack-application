import { Tabs, TabsProps } from '@mui/material'
import React from 'react'
import { TabContext } from './TabsContext'

type LinkTabsProps = React.PropsWithChildren<{
  name?: string
  defaultIndex?: number
}> &
  Pick<TabsProps, 'onChange'>

export const LinkTabs: React.FC<LinkTabsProps> = ({ name, defaultIndex = 0, onChange, children }) => (
  <TabContext.Provider value={{ currentIndex: defaultIndex }}>
    <Tabs value={defaultIndex} onChange={onChange} aria-label={name ?? 'link tabs'} role="navigation">
      {children}
    </Tabs>
  </TabContext.Provider>
)
