import { Link } from 'react-router'
import { TabContext } from './TabsContext'
import { TabsTrigger } from '@/components/ui/tabs'
import { ReactElement } from 'react'

export type TabProps = {
  tabIndex: string
  label: string
  href: string
  icon?: ReactElement
}

export const LinkTab = ({ tabIndex, label, href, icon }: TabProps) => {
  const { currentValue } = TabContext.useValue()
  const dispatch = TabContext.useDispatch()

  return (
    <TabsTrigger
      id={`${tabIndex}`}
      aria-current={tabIndex === currentValue}
      value={href}
      onClick={() => dispatch({ currentValue: tabIndex })}
      asChild
    >
      <Link to={href}>
        {icon}
        {label}
      </Link>
    </TabsTrigger>
  )
}
