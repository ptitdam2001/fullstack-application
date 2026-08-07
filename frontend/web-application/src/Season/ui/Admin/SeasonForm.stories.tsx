import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect, waitFor } from 'storybook/test'
import { getCreateSeasonMockHandler, getUpdateSeasonMockHandler } from '@Sdk/season/season.msw'
import { SeasonForm } from './SeasonForm'

const meta = {
  component: SeasonForm,
  title: 'Season/SeasonForm',
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
      handlers: [getCreateSeasonMockHandler(), getUpdateSeasonMockHandler()],
    },
  },
} satisfies Meta<typeof SeasonForm>

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
    const button = await canvas.findByRole('button', { name: /new season|nouvelle saison/i })
    expect(button).toBeDisabled()
  },
}

export const CreateFillLabel: Story = {
  name: 'Create — libellé rempli active le bouton',
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const labelInput = await canvas.findByRole('textbox', { name: /label|libellé/i })

    await userEvent.clear(labelInput)
    await userEvent.type(labelInput, '2026-2027')

    await waitFor(() => {
      expect(canvas.getByRole('button', { name: /new season|nouvelle saison/i })).not.toBeDisabled()
    })
  },
}

export const CreateSubmit: Story = {
  name: 'Create — soumettre appelle onFinish',
  args: {},
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const labelInput = await canvas.findByRole('textbox', { name: /label|libellé/i })

    await userEvent.clear(labelInput)
    await userEvent.type(labelInput, '2026-2027')

    const submitButton = canvas.getByRole('button', { name: /new season|nouvelle saison/i })
    await waitFor(() => expect(submitButton).not.toBeDisabled())
    await userEvent.click(submitButton)

    await waitFor(() => expect(args.onFinish).toHaveBeenCalled())
  },
}

// ─── Edit mode ────────────────────────────────────────────────────────────────

const existingSeason = { label: '2025-2026' }

export const Edit: Story = {
  name: 'Edit — valeurs pré-remplies',
  args: { seasonId: 'season-1', defaultValues: existingSeason },
}

export const EditButtonInitiallyDisabled: Story = {
  name: 'Edit — bouton désactivé si non modifié',
  args: { seasonId: 'season-1', defaultValues: existingSeason },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = await canvas.findByRole('button', { name: /update|mettre à jour/i })
    expect(button).toBeDisabled()
  },
}

export const EditModifyLabel: Story = {
  name: 'Edit — modifier le libellé active le bouton',
  args: { seasonId: 'season-1', defaultValues: existingSeason },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const labelInput = await canvas.findByRole('textbox', { name: /label|libellé/i })

    await userEvent.clear(labelInput)
    await userEvent.type(labelInput, '2026-2027')

    await waitFor(() => {
      expect(canvas.getByRole('button', { name: /update|mettre à jour/i })).not.toBeDisabled()
    })
  },
}

export const EditSubmit: Story = {
  name: 'Edit — soumettre appelle onFinish',
  args: { seasonId: 'season-1', defaultValues: existingSeason },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const labelInput = await canvas.findByRole('textbox', { name: /label|libellé/i })

    await userEvent.clear(labelInput)
    await userEvent.type(labelInput, '2026-2027')

    const button = await canvas.findByRole('button', { name: /update|mettre à jour/i })
    await waitFor(() => expect(button).not.toBeDisabled())
    await userEvent.click(button)

    await waitFor(() => expect(args.onFinish).toHaveBeenCalled())
  },
}
