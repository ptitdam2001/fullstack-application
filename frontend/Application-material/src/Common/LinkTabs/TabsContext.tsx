import { createContextWithWrite } from '@Common/Context/createContextWithWrite'

type TabContextType = {
  currentIndex: number
}

export const TabContext = createContextWithWrite<TabContextType, TabContextType>('Tab')
