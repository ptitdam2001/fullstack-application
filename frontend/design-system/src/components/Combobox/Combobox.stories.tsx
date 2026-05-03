import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Combobox } from './Combobox'
import { ComboboxItem } from './ComboboxItem'
import { ComboboxSection } from './ComboboxSection'

const meta = {
  component: Combobox,
  decorators: [
    Story => (
      <div className="flex min-h-72 items-start justify-center pt-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Combobox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Combobox label="Équipe" placeholder="Chercher une équipe..." className="w-64">
      <ComboboxItem id="team-a">Équipe A</ComboboxItem>
      <ComboboxItem id="team-b">Équipe B</ComboboxItem>
      <ComboboxItem id="team-c">Équipe C</ComboboxItem>
      <ComboboxItem id="team-d">Équipe D</ComboboxItem>
    </Combobox>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)
    const listbox = within(document.body).getByRole('listbox')
    expect(listbox).toBeVisible()
    const item = within(document.body).getByText('Équipe B')
    await userEvent.click(item)
    expect(input).toHaveValue('Équipe B')
  },
}

export const WithSections: Story = {
  render: () => (
    <Combobox label="Joueur" placeholder="Chercher..." className="w-64">
      <ComboboxSection header="Attaquants">
        <ComboboxItem id="p1">Martin Dupont</ComboboxItem>
        <ComboboxItem id="p2">Paul Bernard</ComboboxItem>
      </ComboboxSection>
      <ComboboxSection header="Défenseurs">
        <ComboboxItem id="p3">Jean Leroy</ComboboxItem>
        <ComboboxItem id="p4">Pierre Simon</ComboboxItem>
      </ComboboxSection>
    </Combobox>
  ),
}

export const FilterOnType: Story = {
  render: () => (
    <Combobox label="Catégorie" placeholder="Taper pour filtrer..." className="w-64">
      <ComboboxItem id="u11">U11</ComboboxItem>
      <ComboboxItem id="u13">U13</ComboboxItem>
      <ComboboxItem id="u15">U15</ComboboxItem>
      <ComboboxItem id="u17">U17</ComboboxItem>
      <ComboboxItem id="senior">Senior</ComboboxItem>
    </Combobox>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox')
    await userEvent.type(input, 'u1')
    const listbox = within(document.body).getByRole('listbox')
    expect(listbox).toBeVisible()
  },
}

export const Disabled: Story = {
  render: () => (
    <Combobox label="Équipe (désactivé)" isDisabled className="w-64">
      <ComboboxItem id="a">Option A</ComboboxItem>
    </Combobox>
  ),
}
