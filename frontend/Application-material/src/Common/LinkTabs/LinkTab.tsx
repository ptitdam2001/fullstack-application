import { Tab, TabProps as MuiTabProps } from '@mui/material'
import { Link } from 'react-router-dom'

export type TabProps = {
  label: string
  href: string
  selected?: boolean
  icon?: MuiTabProps['icon']
}

export const LinkTab = ({ label, href, selected, icon }: TabProps) => (
  <Tab component={Link} aria-current={selected} to={href} label={label} icon={icon} value={href} />
)
