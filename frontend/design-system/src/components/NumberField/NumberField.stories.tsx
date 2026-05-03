import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within, fireEvent } from 'storybook/test'
import { useState } from 'react'

import { NumberField } from './NumberField'

const meta = {
  component: NumberField,
  decorators: [
    Story => (
      <div className="w-48">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NumberField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Score', defaultValue: 0, minValue: 0, maxValue: 20 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [, increment] = canvas.getAllByRole('button')
    fireEvent.click(increment)
    expect(canvas.getByRole('spinbutton')).toHaveValue('1')
  },
}

export const WithStep: Story = {
  args: { label: 'Buts', defaultValue: 0, minValue: 0, maxValue: 30, step: 1 },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState(0)
    return (
      <div className="flex flex-col gap-2">
        <NumberField label="Score équipe A" value={value} onChange={setValue} minValue={0} maxValue={20} />
        <p className="text-muted-foreground text-sm">Valeur : {value}</p>
      </div>
    )
  },
}

export const Disabled: Story = {
  args: { label: 'Score (verrouillé)', defaultValue: 3, isDisabled: true },
}

export const WithValidation: Story = {
  args: {
    label: 'Numéro de maillot',
    defaultValue: 0,
    minValue: 1,
    maxValue: 99,
    isRequired: true,
  },
}
