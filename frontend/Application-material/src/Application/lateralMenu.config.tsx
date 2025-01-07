import { MenuElt } from '@Layouts/components/LateralConnectedMenu'

import PersonIcon from '@mui/icons-material/Person'
import CategoryIcon from '@mui/icons-material/Category'

export const LATERAL_MENU: MenuElt[] = [
  { label: 'My Profile', url: '/app/my-profile', icon: <PersonIcon /> },
  { label: 'Categories', url: '/app/categories', icon: <CategoryIcon /> },
] as const
