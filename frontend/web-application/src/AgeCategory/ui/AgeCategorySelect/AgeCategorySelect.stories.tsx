import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect, waitFor } from 'storybook/test'
import { getGetAgeCategoriesMockHandler } from '@Sdk/age-category/age-category.msw'
import { AgeCategorySelect } from './AgeCategorySelect'

const MOCK_AGE_CATEGORIES = [
  {
    id: 'age-cat-1',
    label: 'U13',
    genre: 'MALE' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'age-cat-2',
    label: 'U15',
    genre: 'FEMALE' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'age-cat-3',
    label: 'Senior',
    genre: 'MIXED' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

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
      handlers: [getGetAgeCategoriesMockHandler(MOCK_AGE_CATEGORIES)],
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
    await userEvent.click(canvas.getByRole('button', { name: /catégorie d'âge/i }))
    await userEvent.click(await canvas.findByRole('option', { name: /u13/i }))
    await waitFor(() => expect(args.onChange).toHaveBeenCalledWith('age-cat-1'))
  },
}

export const SelectNone: Story = {
  name: 'Sélectionner "Aucune" appelle onChange(null)',
  args: { value: 'age-cat-1' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /catégorie d'âge/i }))
    await userEvent.click(await canvas.findByRole('option', { name: /aucune catégorie/i }))
    await waitFor(() => expect(args.onChange).toHaveBeenCalledWith(null))
  },
}
