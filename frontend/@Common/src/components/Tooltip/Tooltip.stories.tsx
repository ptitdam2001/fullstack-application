import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip } from './Tooltip'

const meta = {
  title: 'Common/Tooltip',
  component: Tooltip,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const SimpleUsage: Story = {
  args: {
    title: 'hello Boys!',
    children: <div style={{ margin: '5rem', width: 150 }}>hover Me</div>,
    position: 'top',
  },
}
