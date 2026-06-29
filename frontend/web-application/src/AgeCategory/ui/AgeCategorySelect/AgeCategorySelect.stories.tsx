import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect, waitFor } from 'storybook/test'
import { getGetAgeCategoriesMockHandler } from '@Sdk/age-category/age-category.msw'
import { mockAgeCategories } from '../../../mocks/fixtures'
import { AgeCategorySelect } from './AgeCategorySelect'

const meta = {
  component: AgeCategorySelect,
  title: 'AgeCategory/AgeCategorySelect',
  args: {
    value: null,
    onChange: fn(),
  },
  decorators: [
    Story => (
      <div className="w-80 p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    msw: {
      handlers: [getGetAgeCategoriesMockHandler(mockAgeCategories)],
    },
  },
} satisfies Meta<typeof AgeCategorySelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Aucune sélection',
}

export const WithValue: Story = {
  name: 'Valeur pré-sélectionnée',
  args: { value: 'age-cat-1' },
}

export const SelectOption: Story = {
  name: 'Sélectionner une catégorie appelle onChange(id)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: /catégorie d'âge|age category/i }))
    const listbox = await within(document.body).findByRole('listbox')
    await userEvent.click(await within(listbox).findByRole('option', { name: /u13/i }))
    await waitFor(() => expect(args.onChange).toHaveBeenCalledWith('age-cat-1'))
  },
}

export const SelectNone: Story = {
  name: 'Sélectionner "Aucune" appelle onChange(null)',
  args: { value: 'age-cat-1' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: /catégorie d'âge|age category/i }))
    const listbox = await within(document.body).findByRole('listbox')
    await userEvent.click(within(listbox).getByRole('option', { name: /aucune catégorie|no category/i }))
    await waitFor(() => expect(args.onChange).toHaveBeenCalledWith(null))
  },
}
