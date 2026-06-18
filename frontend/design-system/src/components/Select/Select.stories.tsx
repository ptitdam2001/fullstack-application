import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Select } from './Select'
import { SelectItem } from './SelectItem'
import { SelectSection } from './SelectSection'

const meta = {
  component: Select,
  decorators: [
    (Story) => (
      <div className="flex min-h-48 items-start justify-center pt-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Select {...args} label="Catégorie d'âge" placeholder="Choisir...">
      <SelectItem id="u11">U11</SelectItem>
      <SelectItem id="u13">U13</SelectItem>
      <SelectItem id="u15">U15</SelectItem>
      <SelectItem id="u17">U17</SelectItem>
      <SelectItem id="u19">U19</SelectItem>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button')
    await userEvent.click(trigger)
    const listbox = within(document.body).getByRole('listbox')
    expect(listbox).toBeVisible()
    const u13 = within(document.body).getByText('U13')
    await userEvent.click(u13)
    expect(canvas.getByText('U13')).toBeInTheDocument()
  },
}

export const WithDescription: Story = {
  render: (args) => (
    <Select
      {...args}
      label="Catégorie d'âge"
      placeholder="Choisir..."
      description="Sélectionnez la catégorie d'âge de votre équipe."
    >
      <SelectItem id="u11">U11</SelectItem>
      <SelectItem id="u13">U13</SelectItem>
      <SelectItem id="u15">U15</SelectItem>
    </Select>
  ),
}

export const WithSections: Story = {
  render: (args) => (
    <Select {...args} label="Catégorie" placeholder="Choisir...">
      <SelectSection header="Jeunes">
        <SelectItem id="u11">U11</SelectItem>
        <SelectItem id="u13">U13</SelectItem>
        <SelectItem id="u15">U15</SelectItem>
      </SelectSection>
      <SelectSection header="Seniors">
        <SelectItem id="open">Open</SelectItem>
        <SelectItem id="vets">Vétérans</SelectItem>
      </SelectSection>
    </Select>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <Select {...args} label="Catégorie" placeholder="Désactivé" isDisabled>
      <SelectItem id="u13">U13</SelectItem>
    </Select>
  ),
}

export const KeyboardNavigation: Story = {
  render: (args) => (
    <Select {...args} label="Catégorie d'âge" placeholder="Choisir...">
      <SelectItem id="u11">U11</SelectItem>
      <SelectItem id="u13">U13</SelectItem>
      <SelectItem id="u15">U15</SelectItem>
    </Select>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button')
    await userEvent.click(trigger)
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Enter}')
    expect(canvas.getByText('U13')).toBeInTheDocument()
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')
    expect(within(document.body).queryByRole('listbox')).not.toBeInTheDocument()
  },
}
