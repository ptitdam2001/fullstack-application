import type { Meta, StoryObj } from '@storybook/react'
import Avatar from './Avatar'
import { faker } from '@faker-js/faker'


const meta = {
  title: 'Common/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    imgSrc: faker.image.avatar(),
    shape: 'square',
    size: 25
  },
}
