import type { Meta, StoryObj } from '@storybook/react-vite'
import { UserAccount } from '@Components/Icon'
import { MenuItem } from '../types'
import { LateralMenu } from './LateralMenu'

const menu = [
  {
    label: 'first link',
    icon: <UserAccount />,
    onClick: () => console.log('first link clicked'),
  } as MenuItem,
  {
    label: 'second link',
    icon: <UserAccount />,
    onClick: () => console.log('second link clicked'),
  } as MenuItem,
  {
    label: 'third link',
    icon: <UserAccount />,
    onClick: () => console.log('third link clicked'),
  } as MenuItem,
  {
    label: 'fourth link',
    icon: <UserAccount />,
    onClick: () => console.log('fourth link clicked'),
  } as MenuItem,
  {
    label: 'fifth link',
    icon: <UserAccount />,
    onClick: () => console.log('fifth link clicked'),
  } as MenuItem,
]

const meta = {
  title: 'Common/Menu/LateralMenu',
  component: LateralMenu,
  tags: ['autodocs'],
  parameters: {
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

export const UnClickableItems: Story = {
  args: {
    items: menu.map(({ onClick, ...item }) => item) /* eslint-disable-line @typescript-eslint/no-unused-vars */,
    expanded: true,
  },
}
