import type { Meta, StoryObj } from '@storybook/react'
import { DropDown } from './Dropdown'
import { DropDownProps } from './types'
import { faker } from '@faker-js/faker'
import { fn } from '@storybook/test'
import { Avatar } from '@Components/Avatar/Avatar'

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
  title: 'Navigation/Dropdown',
  component: DropDown,
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
  ],
} satisfies Meta<DropDownProps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    button: <span>My dropdown</span>,
    items,
  },
}

export const WithIcons: Story = {
  args: {
    button: <span>My dropdown trigger</span>,
    items: items.map(item => ({ ...item, icon: <Avatar imgSrc={faker.image.avatarGitHub()} /> })),
  },
}

export const StayOpenOnItemClick: Story = {
  args: {
    button: <span>My dropdown trigger</span>,
    items: items.map(item => ({ ...item, icon: <Avatar imgSrc={faker.image.avatarGitHub()} /> })),
    stayOpenOnClick: true,
  },
}
