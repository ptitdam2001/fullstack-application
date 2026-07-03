import { MapPinHouse, Tags } from 'lucide-react'
import { type ReactElement } from 'react'
import { AuthProvider } from '@Auth/application/AuthProvider'

type TabProps = {
  tabIndex: string
  label: string
  href: string
  icon?: ReactElement
}

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
