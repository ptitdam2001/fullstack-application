import type { Meta, StoryObj } from '@storybook/react'
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
            <div className="bg-amber-500 text-orange-700 w-full h-15 border-orange-700 border rounded-sm flex items-center justify-center">
              {date.toLocaleDateString()}
            </div>
          )}
        />
      </>
    ),
  },
}
