import { createContextWithWrite } from "@repo/design-system"

type TabContextType = {
  currentValue?: string
}

export const TabContext = createContextWithWrite<TabContextType, TabContextType>('Tab')
