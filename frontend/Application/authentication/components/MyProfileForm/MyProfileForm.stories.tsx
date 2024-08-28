import type { Meta, StoryObj } from '@storybook/react'
import { MyProfileForm } from './MyProfileForm'
import { fn } from '@storybook/test'

const meta = {
  title: 'Authentication/MyProfileForm',
  component: MyProfileForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: { onConnectionDone: fn() },
} satisfies Meta<typeof MyProfileForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
