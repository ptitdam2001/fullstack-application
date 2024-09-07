import type { Meta, StoryObj } from '@storybook/react'
import { MyProfilMenu } from './MyProfilMenu'

const meta = {
  title: 'Authentication/MyProfilMenu',
  component: MyProfilMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof MyProfilMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
