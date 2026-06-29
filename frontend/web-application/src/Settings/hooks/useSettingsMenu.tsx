import { type TabProps } from '@Common/LinkTabs/LinkTab'
import { MapPinHouse, Tags } from 'lucide-react'
import { AuthProvider } from '@Auth/application/AuthProvider'

const areasItem: TabProps = {
  tabIndex: 'areas',
  label: 'Area',
  href: 'areas',
  icon: <MapPinHouse />,
}

const ageCategoryItem: TabProps = {
  tabIndex: 'age-categories',
  label: "Catégories d'âge",
  href: 'age-categories',
  icon: <Tags />,
}

type Output = {
  list: TabProps[]
}

export const useSettingsMenu = (): Output => {
  const { user } = AuthProvider.useAuthValue()
  return { list: user?.isAdmin ? [areasItem, ageCategoryItem] : [areasItem] }
}
