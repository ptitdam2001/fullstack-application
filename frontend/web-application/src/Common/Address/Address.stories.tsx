import type { Meta, StoryObj } from '@storybook/react-vite'

import { Address } from './Address'
import { faker } from '@faker-js/faker'

const meta = {
  component: Address,
} satisfies Meta<typeof Address>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    address: {
      name: 'Test Address',
      address: '123 Test St',
      city: 'Test City',
      _id: faker.string.uuid(),
      longitude: 1,
      latitude: 1,
    },
  },
}
