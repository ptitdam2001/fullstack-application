import { Tabs, TabsProps } from '@mui/material'
import React from 'react'
import { LinkTab, TabProps } from './LinkTab'

type LinkTabsProps = {
  tabs: TabProps[]
  name?: string
  value?: string
} & Pick<TabsProps, 'onChange'>

export const LinkTabs: React.FC<LinkTabsProps> = ({ tabs, name, value, onChange }) => {
  return (
    <Tabs value={value ?? tabs[0].href} onChange={onChange} aria-label={name ?? 'link tabs'} role="navigation">
      {tabs.map(tab => (
        <LinkTab key={tab.href} {...tab} />
      ))}
    </Tabs>
  )
}
