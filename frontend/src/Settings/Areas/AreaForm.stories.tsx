import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AreaForm } from './AreaForm'
import Toast from '@Common/Toast/Toast'
import { faker } from '@faker-js/faker'
import { getCreateAreaMockHandler, getUpdateAreaMockHandler } from '@Sdk/area/area.msw'

const meta = {
  component: AreaForm,
  decorators: [
    Story => (
      <Toast.Provider>
        <Story />
      </Toast.Provider>
    ),
  ],
  args: {
    onFinish: fn(),
  },
  parameters: {
    msw: {
      handlers: {
        area: [getCreateAreaMockHandler(), getUpdateAreaMockHandler()],
      },
    },
  },
} satisfies Meta<typeof AreaForm>

export default meta

type Story = StoryObj<typeof meta>

export const Create: Story = {
  args: {
    defaultValues: {
      name: 'Test Address',
      address: '123 Test St',
      city: 'Test City',
      longitude: 1,
      latitude: 1,
    },
  },
}

export const Edit: Story = {
  args: {
    areaId: faker.string.uuid(),
    defaultValues: {
      name: 'Test Address',
      address: '123 Test St',
      city: 'Test City',
      longitude: 1,
      latitude: 1,
    },
  },
}
