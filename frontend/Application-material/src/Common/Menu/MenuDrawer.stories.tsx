import type { Meta, StoryObj } from '@storybook/react'

import { MenuDrawer } from './MenuDrawer'
import { OpenProvider } from '@Providers/OpenProvider'
import { MenuToggleButton } from './MenuToggleButton'

const meta = {
  component: MenuDrawer,
  decorators: [
    Story => (
      <OpenProvider.Provider value={false}>
        <Story />
        <MenuToggleButton />
      </OpenProvider.Provider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof MenuDrawer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <div>Test</div>,
  },
}
