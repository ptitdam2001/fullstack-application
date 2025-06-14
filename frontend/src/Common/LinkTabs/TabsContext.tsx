import { createContextWithWrite } from '@Common/Context/createContextWithWrite'

type TabContextType = {
  currentValue?: string
}

export const TabContext = createContextWithWrite<TabContextType, TabContextType>('Tab')
