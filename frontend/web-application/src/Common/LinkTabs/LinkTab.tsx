import { useNavigate } from 'react-router'
import { TabsTrigger } from '@repo/design-system'
import { type ReactElement } from 'react'

export type TabProps = {
  tabIndex: string
  label: string
  href: string
  icon?: ReactElement
}

export const LinkTab = ({ tabIndex, label, href, icon }: TabProps) => {
  const navigate = useNavigate()
  return (
    <TabsTrigger value={tabIndex} onPress={() => navigate(href)}>
      {icon}
      {label}
    </TabsTrigger>
  )
}
