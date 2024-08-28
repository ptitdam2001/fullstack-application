import { Meta, StoryObj } from '@storybook/react'
import Card from './Card'
import { CardProps } from './types'

const meta = {
  title: 'Common/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div className="p-2 bg-slate-400 h-full w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<CardProps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <div>My content</div>,
    'data-testid': 'myCard',
  },
}
