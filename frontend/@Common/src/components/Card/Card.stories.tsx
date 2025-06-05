import { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardProps } from './Card'

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
    testId: 'myCard',
  },
}
