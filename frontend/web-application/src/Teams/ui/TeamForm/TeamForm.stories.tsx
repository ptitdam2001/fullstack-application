import type { Meta, StoryObj } from '@storybook/react-vite'
import { within, userEvent, expect, waitFor } from 'storybook/test'
import { getCreateTeamMockHandler, getUpdateTeamMockHandler } from '@Sdk/team/team.msw'
import { TeamForm } from './TeamForm'

const meta = {
  component: TeamForm,
  title: 'Teams/TeamForm',
  decorators: [
    Story => (
      <div className="h-screen w-96 p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    msw: {
      handlers: [getCreateTeamMockHandler(), getUpdateTeamMockHandler()],
    },
  },
} satisfies Meta<typeof TeamForm>

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
    const button = canvas.getByRole('button', { name: /create/i })
    expect(button).toBeDisabled()
  },
}

export const CreateFillName: Story = {
  name: 'Create — saisir le nom active le bouton',
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nameInput = canvas.getByTestId('team-form.name.input')
    const button = canvas.getByRole('button', { name: /create/i })

    expect(button).toBeDisabled()

    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Les Rouges')

    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  },
}

export const CreateSubmit: Story = {
  name: 'Create — soumettre le formulaire',
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nameInput = canvas.getByTestId('team-form.name.input')

    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Les Rouges')

    const button = canvas.getByRole('button', { name: /create/i })
    await waitFor(() => expect(button).not.toBeDisabled())

    await userEvent.click(button)

    // MSW a un delay de 500ms — le bouton doit passer en loading
    await waitFor(() => {
      expect(canvas.getByRole('button', { name: /create/i })).toBeDisabled()
    })
  },
}

// ─── Edit mode ────────────────────────────────────────────────────────────────

const existingTeam = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Les Bleus',
  color: '#3182ce',
  areas: [],
}

export const Edit: Story = {
  name: 'Edit — valeurs pré-remplies',
  args: {
    teamId: 'team-1',
    defaultValues: existingTeam,
  },
}

export const EditButtonInitiallyDisabled: Story = {
  name: 'Edit — bouton désactivé si non modifié',
  args: {
    teamId: 'team-1',
    defaultValues: existingTeam,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /update/i })
    expect(button).toBeDisabled()
  },
}

export const EditModifyName: Story = {
  name: 'Edit — modifier le nom active le bouton',
  args: {
    teamId: 'team-1',
    defaultValues: existingTeam,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nameInput = canvas.getByTestId('team-form.name.input')
    const button = canvas.getByRole('button', { name: /update/i })

    expect(button).toBeDisabled()

    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Les Rouges Modifiés')

    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  },
}

export const EditSubmit: Story = {
  name: 'Edit — soumettre les modifications',
  args: {
    teamId: 'team-1',
    defaultValues: existingTeam,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nameInput = canvas.getByTestId('team-form.name.input')

    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Les Rouges Modifiés')

    const button = canvas.getByRole('button', { name: /update/i })
    await waitFor(() => expect(button).not.toBeDisabled())

    await userEvent.click(button)

    await waitFor(() => {
      expect(canvas.getByRole('button', { name: /update/i })).toBeDisabled()
    })
  },
}
