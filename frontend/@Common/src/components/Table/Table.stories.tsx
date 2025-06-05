import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table } from './Table'
import { faker } from '@faker-js/faker'
import { Close } from '@Components/Icon'
import { useState } from 'react'
import { usePagination } from '@Hooks/usePagination'
import { Avatar } from '@Components/Avatar/Avatar'
import { fn } from 'storybook/test'

interface DataType {
  avatar: string
  user: string
  role: string
  createdAt: Date
  status: string
}

function createData(): DataType {
  return {
    avatar: faker.image.avatar(),
    user: faker.person.fullName(),
    role: faker.person.jobTitle(),
    createdAt: faker.date.past(),
    status: faker.helpers.arrayElement(['active', 'inactive']),
  }
}

function generateData(nbElement: number) {
  return new Array(nbElement).fill(null).map(() => createData())
}

const meta = {
  title: 'Common/Table',
  component: Table<DataType>,
  tags: ['autodocs'],
  decorators: [Story => <div>{<Story />}</div>],
} satisfies Meta<typeof Table<DataType>>

export default meta
type Story = StoryObj<typeof meta>

const columns = [
  {
    key: 'user',
    label: 'User',
    render: (elt: DataType) => (
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Avatar imgSrc={elt.avatar} size="2.5rem" />
        </div>
        <div className="ml-3">
          <p className="text-gray-900 whitespace-no-wrap">{elt.user}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    label: 'Role',
  },
  {
    key: 'createdAt',
    label: 'Created at',
    render: (elt: DataType) => <>{elt.createdAt.toDateString()}</>,
  },
  {
    key: 'status',
    label: 'Status',
  },
]

export const Default: Story = {
  args: {
    columns,
    data: generateData(10),
  },
}

export const WithBorder: Story = {
  args: {
    columns,
    data: generateData(10),
    withBorder: true,
  },
}

export const ExampleWithPagination = () => {
  const [data, setData] = useState<DataType[]>(generateData(10))
  const { currentPage, gotoPage } = usePagination(() => {
    setData(generateData(10))
  })

  return (
    <Table<DataType>
      title="My table"
      columns={[
        {
          key: 'user',
          label: 'User',
          render: (elt: DataType) => (
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <a href="#" className="relative block">
                  <img alt="profil" src={elt.avatar} className="mx-auto object-cover rounded-full h-10 w-10 " />
                </a>
              </div>
              <div className="ml-3">
                <p className="text-gray-900 whitespace-no-wrap">{elt.user}</p>
              </div>
            </div>
          ),
        },
        {
          key: 'role',
          label: 'Role',
        },
        {
          key: 'createdAt',
          label: 'Created at',
          render: (elt: { createdAt: { toDateString: () => unknown } }) => <>{elt.createdAt.toDateString()}</>,
        },
        {
          key: 'status',
          label: 'Status',
        },
      ]}
      rowActions={[
        {
          icon: <Close />,
          label: 'Close',
          onClick: fn(),
          disable: (row: { status: string }) => row.status === 'inactive',
        },
      ]}
      pagination={{
        currentPage,
        maxPage: 6,
        onClick: gotoPage,
      }}
      data={data}
    />
  )
}
