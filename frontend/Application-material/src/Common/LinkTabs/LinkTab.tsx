import { Tab, TabProps as MuiTabProps } from '@mui/material'
import { Link } from 'react-router'
import { TabContext } from './TabsContext'

export type TabProps = {
  tabIndex: number
  label: string
  href: string
  icon?: MuiTabProps['icon']
}

export const LinkTab = ({ tabIndex, label, href, icon }: TabProps) => {
  const { currentIndex } = TabContext.useValue()
  const dispatch = TabContext.useDispatch()

  return (
    <Tab
      id={`${tabIndex}`}
      component={Link}
      aria-current={tabIndex === currentIndex}
      to={href}
      label={label}
      icon={icon}
      value={href}
      onClick={() => dispatch({ currentIndex: tabIndex })}
      wrapped
    />
  )
}
