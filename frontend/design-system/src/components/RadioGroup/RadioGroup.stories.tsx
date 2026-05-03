import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'

import { RadioGroup } from './RadioGroup'
import { Radio } from './Radio'

const meta = {
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <RadioGroup label="Catégorie d'âge">
      <Radio value="u11">U11</Radio>
      <Radio value="u13">U13</Radio>
      <Radio value="u15">U15</Radio>
      <Radio value="senior">Senior</Radio>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radios = canvas.getAllByRole('radio')
    await userEvent.click(radios[1])
    expect(radios[1]).toBeChecked()
    expect(radios[0]).not.toBeChecked()
  },
}

export const Horizontal: Story = {
  render: () => (
    <RadioGroup label="Résultat" orientation="horizontal">
      <Radio value="win">Victoire</Radio>
      <Radio value="draw">Nul</Radio>
      <Radio value="loss">Défaite</Radio>
    </RadioGroup>
  ),
}

export const WithDefaultValue: Story = {
  render: () => (
    <RadioGroup label="Rôle" defaultValue="coach">
      <Radio value="admin">Admin</Radio>
      <Radio value="coach">Coach</Radio>
      <Radio value="referee">Arbitre</Radio>
      <Radio value="player">Joueur</Radio>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup label="Options (désactivé)" isDisabled>
      <Radio value="a">Option A</Radio>
      <Radio value="b">Option B</Radio>
    </RadioGroup>
  ),
}

export const DisabledItem: Story = {
  render: () => (
    <RadioGroup label="Statut">
      <Radio value="active">Actif</Radio>
      <Radio value="inactive" isDisabled>Inactif (désactivé)</Radio>
      <Radio value="pending">En attente</Radio>
    </RadioGroup>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('u13')
    return (
      <div className="flex flex-col gap-4">
        <RadioGroup label="Catégorie" value={value} onChange={setValue}>
          <Radio value="u11">U11</Radio>
          <Radio value="u13">U13</Radio>
          <Radio value="u15">U15</Radio>
        </RadioGroup>
        <p className="text-muted-foreground text-sm">Sélection : {value}</p>
      </div>
    )
  },
}

export const KeyboardNavigation: Story = {
  render: () => (
    <RadioGroup label="Navigation clavier">
      <Radio value="a">Alpha</Radio>
      <Radio value="b">Beta</Radio>
      <Radio value="c">Gamma</Radio>
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const radios = canvas.getAllByRole('radio')
    radios[0].focus()
    expect(radios[0]).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    expect(radios[1]).toBeChecked()
  },
}
