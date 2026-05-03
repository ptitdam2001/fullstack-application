import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'

import { DatePicker } from './DatePicker'
import { Calendar } from './Calendar'

const meta = {
  component: DatePicker,
  decorators: [
    Story => (
      <div className="flex min-h-96 items-start justify-center pt-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => {
    const [date, setDate] = useState<Date | undefined>()
    return (
      <DatePicker
        {...args}
        label="Date du match"
        value={date}
        onChange={setDate}
        className="w-64"
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button')
    await userEvent.click(trigger)
    const calendar = within(document.body).getByRole('grid')
    expect(calendar).toBeVisible()
    await userEvent.keyboard('{Escape}')
  },
}

export const WithValue: Story = {
  render: args => {
    const [date, setDate] = useState<Date | undefined>(new Date(2024, 5, 15))
    return (
      <DatePicker
        {...args}
        label="Date de naissance"
        value={date}
        onChange={setDate}
        className="w-64"
      />
    )
  },
}

export const Disabled: Story = {
  args: {
    label: 'Date (désactivé)',
    isDisabled: true,
    className: 'w-64',
  },
}

export const CalendarStandalone: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>()
    return <Calendar mode="single" selected={date} onSelect={setDate} />
  },
}

export const CalendarWithRange: Story = {
  render: () => {
    const [range, setRange] = useState<{ from?: Date; to?: Date } | undefined>()
    return <Calendar mode="range" selected={range} onSelect={setRange} />
  },
}
