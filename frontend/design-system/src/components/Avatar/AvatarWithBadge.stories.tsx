import type { Meta, StoryObj } from '@storybook/react-vite'

import { AvatarWithBadge } from './AvatarWithBadge'
import { faker } from '@faker-js/faker'

const meta = {
  component: AvatarWithBadge,
} satisfies Meta<typeof AvatarWithBadge>

export default meta

type Story = StoryObj<typeof meta>

export const DefaultSize: Story = {
  args: {
    badge: {
      content: 1,
    },
    avatar: {
      url: faker.image.avatar(),
    },
  },
}

export const SmallSize: Story = {
  args: {
    size: 'sm',
    badge: {
      content: 1,
    },
    avatar: {
      url: faker.image.avatar(),
    },
  },
}

export const LargeSize: Story = {
  args: {
    size: 'lg',
    badge: {
      content: 1,
    },
    avatar: {
      url: faker.image.avatar(),
    },
  },
}

export const WithoutImageAsBadgeMd: Story = {
  args: {
    badge: {
      url: faker.image.avatar(),
    },
    avatar: {
      url: faker.image.avatar(),
    },
  },
}

export const WithoutImageAsBadgeSm: Story = {
  args: {
    size: 'sm',
    badge: {
      url: faker.image.avatar(),
    },
    avatar: {
      url: faker.image.avatar(),
    },
  },
}

export const WithoutImageAsBadgeLg: Story = {
  args: {
    size: 'lg',
    badge: {
      url: faker.image.avatar(),
    },
    avatar: {
      url: faker.image.avatar(),
    },
  },
}
