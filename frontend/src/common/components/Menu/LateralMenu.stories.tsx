import type { Meta, StoryObj } from '@storybook/react'
import { LateralMenu } from './LateralMenu'
import { UserAccount } from '../Icon'
import { MenuItem } from './types'

const menu = [
  {
    label: 'first link',
    icon: <UserAccount />,
    onClick: () => console.log('first link clicked'),
  } as MenuItem,
  {
    label: 'second link',
    icon: <UserAccount />,
    onClick: () => console.log('first link clicked'),
  } as MenuItem,
  {
    label: 'third link',
    icon: <UserAccount />,
    onClick: () => console.log('first link clicked'),
  } as MenuItem,
  {
    label: 'fourth link',
    icon: <UserAccount />,
    onClick: () => console.log('first link clicked'),
  } as MenuItem,
  {
    label: 'fifth link',
    icon: <UserAccount />,
    onClick: () => console.log('first link clicked'),
  } as MenuItem,
]

const meta = {
  title: 'Common/Menu/LateralMenu',
  component: LateralMenu,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LateralMenu>

export default meta
type Story = StoryObj<typeof meta>

export const SimpleUsage: Story = {
  args: {
    items: menu,
  },
}

export const ExpandedUsage: Story = {
  args: {
    items: menu,
    expanded: true,
  },
}
