import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect, waitFor } from 'storybook/test'
import { getCreateAgeCategoryMockHandler, getUpdateAgeCategoryMockHandler } from '@Sdk/age-category/age-category.msw'
import { AgeCategoryForm } from './AgeCategoryForm'

const meta = {
  component: AgeCategoryForm,
  title: 'AgeCategory/AgeCategoryForm',
  args: {
    onFinish: fn(),
  },
  decorators: [
    Story => (
      <div className="h-screen w-96 p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    msw: {
      handlers: [getCreateAgeCategoryMockHandler(), getUpdateAgeCategoryMockHandler()],
    },
  },
} satisfies Meta<typeof AgeCategoryForm>

export default meta
type Story = StoryObj<typeof meta>

// ─── Create mode ──────────────────────────────────────────────────────────────

export const Create: Story = {
  name: 'Create — champs vides',
  args: {},
}

export const CreateButtonInitiallyDisabled: Story = {
  name: 'Create — bouton désactivé initialement',
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('button', { name: /nouvelle catégorie/i })).toBeDisabled()
  },
}

export const CreateFillLabelOnly: Story = {
  name: 'Create — libellé seul ne suffit pas (genre requis)',
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const labelInput = canvas.getByRole('textbox', { name: /libellé/i })

    await userEvent.clear(labelInput)
    await userEvent.type(labelInput, 'U13')

    expect(canvas.getByRole('button', { name: /nouvelle catégorie/i })).toBeDisabled()
  },
}

export const CreateFillAll: Story = {
  name: 'Create — libellé + genre activent le bouton',
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.clear(canvas.getByRole('textbox', { name: /libellé/i }))
    await userEvent.type(canvas.getByRole('textbox', { name: /libellé/i }), 'U13')

    await userEvent.click(canvas.getByRole('button', { name: /genre/i }))
    await userEvent.click(await canvas.findByRole('option', { name: /masculin/i }))

    await waitFor(() => {
      expect(canvas.getByRole('button', { name: /nouvelle catégorie/i })).not.toBeDisabled()
    })
  },
}

export const CreateSubmit: Story = {
  name: 'Create — soumettre appelle onFinish',
  args: {},
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await userEvent.clear(canvas.getByRole('textbox', { name: /libellé/i }))
    await userEvent.type(canvas.getByRole('textbox', { name: /libellé/i }), 'U13')

    await userEvent.click(canvas.getByRole('button', { name: /genre/i }))
    await userEvent.click(await canvas.findByRole('option', { name: /masculin/i }))

    const submitButton = canvas.getByRole('button', { name: /nouvelle catégorie/i })
    await waitFor(() => expect(submitButton).not.toBeDisabled())
    await userEvent.click(submitButton)

    await waitFor(() => expect(args.onFinish).toHaveBeenCalled())
  },
}

// ─── Edit mode ────────────────────────────────────────────────────────────────

const existingAgeCategory = { label: 'U13', genre: 'MALE' as const }

export const Edit: Story = {
  name: 'Edit — valeurs pré-remplies',
  args: { ageCategoryId: 'age-category-1', defaultValues: existingAgeCategory },
}

export const EditButtonInitiallyDisabled: Story = {
  name: 'Edit — bouton désactivé si non modifié',
  args: { ageCategoryId: 'age-category-1', defaultValues: existingAgeCategory },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('button', { name: /mettre à jour/i })).toBeDisabled()
  },
}

export const EditModifyLabel: Story = {
  name: 'Edit — modifier le libellé active le bouton',
  args: { ageCategoryId: 'age-category-1', defaultValues: existingAgeCategory },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const labelInput = canvas.getByRole('textbox', { name: /libellé/i })

    await userEvent.clear(labelInput)
    await userEvent.type(labelInput, 'U15')

    await waitFor(() => {
      expect(canvas.getByRole('button', { name: /mettre à jour/i })).not.toBeDisabled()
    })
  },
}

export const EditSubmit: Story = {
  name: 'Edit — soumettre appelle onFinish',
  args: { ageCategoryId: 'age-category-1', defaultValues: existingAgeCategory },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const labelInput = canvas.getByRole('textbox', { name: /libellé/i })

    await userEvent.clear(labelInput)
    await userEvent.type(labelInput, 'U15')

    const button = canvas.getByRole('button', { name: /mettre à jour/i })
    await waitFor(() => expect(button).not.toBeDisabled())
    await userEvent.click(button)

    await waitFor(() => expect(args.onFinish).toHaveBeenCalled())
  },
}
