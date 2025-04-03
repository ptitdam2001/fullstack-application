import type { Meta, StoryObj } from '@storybook/react'

import { AvatarWithBadge } from './AvatarWithBadge'
import { faker } from '@faker-js/faker'

const meta = {
  component: AvatarWithBadge,
} satisfies Meta<typeof AvatarWithBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    badge: {
      content: 1,
    },
    avatar: {
      url: faker.image.avatar(),
    },
  },
}

export const WithoutImageAsBadge: Story = {
  args: {
    badge: {
      url: faker.image.avatar(),
    },
    avatar: {
      url: faker.image.avatar(),
    },
  },
}
