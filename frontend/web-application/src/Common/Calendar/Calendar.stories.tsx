import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar } from './Calendar'

const meta = {
  component: Calendar.Container,
  title: 'Calendar/Calendar',
} satisfies Meta<typeof Calendar.Container>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <Calendar.Navigation />
        <Calendar.Content />
      </>
    ),
  },
}

export const WithCustomDay: Story = {
  args: {
    children: (
      <>
        <Calendar.Navigation />
        <Calendar.Content
          children={date => (
            <div className="flex h-15 w-full items-center justify-center rounded-sm border border-orange-700 bg-amber-500 text-orange-700">
              {date.toLocaleDateString()}
            </div>
          )}
        />
      </>
    ),
  },
}
