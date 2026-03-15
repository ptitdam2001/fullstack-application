import { FC } from 'react'
import { Link } from 'react-router'
import { MenuBarActionLink } from './types'

export const LinkAction: FC<MenuBarActionLink> = ({ url, label }) => <Link to={url}>{label}</Link>
