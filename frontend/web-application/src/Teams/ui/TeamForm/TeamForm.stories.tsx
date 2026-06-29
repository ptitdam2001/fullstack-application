import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect, waitFor } from 'storybook/test'
import { getCreateTeamMockHandler, getUpdateTeamMockHandler } from '@Sdk/team/team.msw'
import { getGetAgeCategoriesMockHandler } from '@Sdk/age-category/age-category.msw'
import { mockAgeCategories } from '../../../mocks/fixtures'
import { TeamForm } from './TeamForm'

const meta = {
  component: TeamForm,
  title: 'Teams/TeamForm',
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
      handlers: [
        getCreateTeamMockHandler(),
        getUpdateTeamMockHandler(),
        getGetAgeCategoriesMockHandler(mockAgeCategories),
      ],
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
    const button = await canvas.findByRole('button', { name: /create/i })
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

export const CreateSelectAgeCategory: Story = {
  name: "Create — sélectionner une catégorie d'âge",
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.clear(canvas.getByTestId('team-form.name.input'))
    await userEvent.type(canvas.getByTestId('team-form.name.input'), 'Les Rouges')

    await userEvent.click(await canvas.findByRole('button', { name: /catégorie d'âge|age category/i }))
    const listbox = await within(document.body).findByRole('listbox')
    await userEvent.click(await within(listbox).findByRole('option', { name: /u13/i }))

    await waitFor(() => {
      expect(canvas.getByRole('button', { name: /create/i })).not.toBeDisabled()
    })
  },
}

export const CreateSubmit: Story = {
  name: 'Create — soumettre appelle onFinish',
  args: {},
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const nameInput = canvas.getByTestId('team-form.name.input')

    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Les Rouges')

    const button = canvas.getByRole('button', { name: /create/i })
    await waitFor(() => expect(button).not.toBeDisabled())

    await userEvent.click(button)

    await waitFor(() => expect(args.onFinish).toHaveBeenCalled())
  },
}

// ─── Edit mode ────────────────────────────────────────────────────────────────

const existingTeam = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Les Bleus',
  color: '#3182ce',
  areas: [],
  ageCategoryId: 'age-cat-1',
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
  name: 'Edit — soumettre appelle onFinish',
  args: {
    teamId: 'team-1',
    defaultValues: existingTeam,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const nameInput = canvas.getByTestId('team-form.name.input')

    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Les Rouges Modifiés')

    const button = canvas.getByRole('button', { name: /update/i })
    await waitFor(() => expect(button).not.toBeDisabled())

    await userEvent.click(button)

    await waitFor(() => expect(args.onFinish).toHaveBeenCalled())
  },
}
