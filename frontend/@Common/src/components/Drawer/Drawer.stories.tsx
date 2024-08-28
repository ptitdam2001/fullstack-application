import type { Meta, StoryObj } from '@storybook/react'
import { Drawer } from './Drawer'
import { DrawerProps } from './types'
import { fn } from '@storybook/test'

const DrawerContent = () => (
  <ul>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
    <li>Line</li>
  </ul>
)

const meta = {
  title: 'Common/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div className="bg-slate-400 w-full h-128">
        <Story />
      </div>
    ),
  ],
  args: {
    onOpenChange: fn(),
  },
} satisfies Meta<DrawerProps>

export default meta
type Story = StoryObj<typeof meta>

export const SimpleUsage: Story = {
  args: {
    title: 'My title left',
    content: <DrawerContent />,
  },
}

export const RightUsage: Story = {
  args: {
    title: 'My title right',
    position: 'right',
    content: <DrawerContent />,
  },
}
