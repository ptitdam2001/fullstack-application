import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'

import { Switch } from './Switch'

const meta = {
  component: Switch,
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Activer les notifications' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sw = canvas.getByRole('switch')
    expect(sw).not.toBeChecked()
    await userEvent.click(sw)
    expect(sw).toBeChecked()
    await userEvent.click(sw)
    expect(sw).not.toBeChecked()
  },
}

export const Checked: Story = {
  args: { children: 'Mode sombre', defaultSelected: true },
}

export const Disabled: Story = {
  args: { children: 'Fonctionnalité désactivée', isDisabled: true },
}

export const DisabledChecked: Story = {
  args: { children: 'Activé (verrouillé)', isDisabled: true, defaultSelected: true },
}

export const Controlled: Story = {
  render: () => {
    const [on, setOn] = useState(false)
    return (
      <div className="flex flex-col gap-4">
        <Switch isSelected={on} onChange={setOn}>
          {on ? 'Activé' : 'Désactivé'}
        </Switch>
        <p className="text-muted-foreground text-sm">État : {on ? 'ON' : 'OFF'}</p>
      </div>
    )
  },
}

export const KeyboardToggle: Story = {
  args: { children: 'Naviguer au clavier' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sw = canvas.getByRole('switch')
    await userEvent.tab()
    expect(sw).toHaveFocus()
    await userEvent.keyboard(' ')
    expect(sw).toBeChecked()
  },
}
