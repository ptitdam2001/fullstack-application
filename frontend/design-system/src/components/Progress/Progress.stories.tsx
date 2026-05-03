import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState, useEffect } from 'react'

import { Progress } from './Progress'

const meta = {
  component: Progress,
  decorators: [
    Story => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { value: 60 },
}

export const WithLabel: Story = {
  args: { value: 45, label: 'Progression' },
}

export const WithLabelAndValue: Story = {
  args: { value: 75, label: 'Chargement', showValue: true },
}

export const Complete: Story = {
  args: { value: 100, label: 'Terminé', showValue: true },
}

export const Empty: Story = {
  args: { value: 0, label: 'En attente', showValue: true },
}

export const Animated: Story = {
  render: () => {
    const [value, setValue] = useState(0)
    useEffect(() => {
      const id = setInterval(() => {
        setValue(v => (v >= 100 ? 0 : v + 5))
      }, 300)
      return () => clearInterval(id)
    }, [])
    return <Progress value={value} label="Synchronisation" showValue />
  },
}
