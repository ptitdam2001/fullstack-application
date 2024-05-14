import type { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'
import Dropdown from './Dropdown'
import { DropDownProps } from './types'
import { faker } from '@faker-js/faker'
import { fn } from '@storybook/test'
import { Avatar } from '../Avatar'

const items = [
  {
    label: faker.person.firstName(),
    desc: faker.person.jobTitle(),
    onClick: fn(),
  },
  {
    label: faker.person.firstName(),
    desc: faker.person.jobTitle(),
    onClick: fn(),
  },
  {
    label: faker.person.firstName(),
    desc: faker.person.jobTitle(),
    onClick: fn(),
  },
]

const meta = {
  title: 'Common/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div className="bg-white w-full h-128">
        <Story />
      </div>
    ),
    withRouter,
  ],
} satisfies Meta<DropDownProps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    button: <button>My dropdown</button>,
    items,
  },
}

export const WithIcons: Story = {
  args: {
    button: <button>My dropdown trigger</button>,
    items: items.map(item => ({ ...item, icon: <Avatar imgSrc={faker.image.avatar()} /> })),
  },
}

export const StayOpenOnItemClick: Story = {
  args: {
    button: <button>My dropdown trigger</button>,
    items: items.map(item => ({ ...item, icon: <Avatar imgSrc={faker.image.avatar()} /> })),
    stayOpenOnClick: true,
  },
}
