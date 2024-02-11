import type { Meta, StoryObj } from '@storybook/react'
import { Drawer } from './Drawer'

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
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Drawer>

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
