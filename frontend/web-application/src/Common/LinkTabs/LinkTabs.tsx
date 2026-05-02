import React from 'react'
import { Tabs } from '@repo/design-system'

type LinkTabsProps = React.PropsWithChildren<{
  name?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}>

export const LinkTabs: React.FC<LinkTabsProps> = ({ name, defaultValue, onValueChange, children }) => (
  <Tabs defaultValue={defaultValue} onValueChange={onValueChange} aria-label={name ?? 'link tabs'} role="navigation">
    {children}
  </Tabs>
)
