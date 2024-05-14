import type { Meta, StoryObj } from '@storybook/react'
import { AppBar, AppBarProps } from './AppBar'
import { UserAccount } from '../Icon'

const meta = {
  title: 'Common/AppBar',
  component: AppBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'My Title',
  },
} satisfies Meta<AppBarProps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithLogo: Story = {
  args: {
    logo: {
      img: <UserAccount />,
    },
  },
}

export const WithRightContent: Story = {
  args: {
    logo: {
      img: <UserAccount />,
    },
    rightContent: <div>My right</div>,
  },
}
