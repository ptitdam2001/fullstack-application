import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect, waitFor } from 'storybook/test'
import { getGetChampionshipsMockHandler, getCountChampionshipsMockHandler } from '@Sdk/championship/championship.msw'
import { getGetAgeCategoriesMockHandler, getCountAgeCategoriesMockHandler } from '@Sdk/age-category/age-category.msw'
import type { Championship } from '@Championship/domain/Championship'
import { mockAgeCategories } from '../../../mocks/fixtures'
import { MatchFilters } from './MatchFilters'

const mockChampionships: Championship[] = [
  {
    id: 'champ-1',
    name: 'Championnat U13',
    ageCategoryId: 'age-cat-1',
    seasonId: 'season-1',
    pointsConfig: { win: 3, draw: 1, loss: 0, forfeit: 0 },
    isDraft: false,
    isFinished: false,
    currentPhaseType: 'GROUP',
    teamsCount: 8,
    matchesPlayed: 3,
    matchesTotal: 12,
  },
  {
    id: 'champ-2',
    name: 'Championnat U15',
    ageCategoryId: 'age-cat-2',
    seasonId: 'season-1',
    pointsConfig: { win: 3, draw: 1, loss: 0, forfeit: 0 },
    isDraft: false,
    isFinished: false,
    currentPhaseType: 'GROUP',
    teamsCount: 8,
    matchesPlayed: 0,
    matchesTotal: 12,
  },
]

const meta = {
  component: MatchFilters,
  title: 'Match/MatchFilters',
  args: {
    filters: {},
    resultCount: 8,
    onChange: fn(),
  },
  decorators: [
    Story => (
      <div className="w-full max-w-3xl p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        getGetChampionshipsMockHandler(mockChampionships),
        getCountChampionshipsMockHandler(mockChampionships.length),
        getGetAgeCategoriesMockHandler(mockAgeCategories),
        getCountAgeCategoriesMockHandler(mockAgeCategories.length),
      ],
    },
  },
} satisfies Meta<typeof MatchFilters>

export default meta
type Story = StoryObj<typeof meta>

const RESET_LABEL = /réinitialiser|reset/i
const PLAYED_TAB_LABEL = /joué|played/i
const CHAMPIONSHIP_LABEL = /championnat|championship/i

export const Default: Story = {
  name: 'Aucun filtre actif',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.queryByText(RESET_LABEL)).not.toBeInTheDocument()
    await canvas.findByText(/^8 (matchs|matches)$/)
  },
}

export const WithActiveFilters: Story = {
  name: 'Filtre actif affiche le bouton Réinitialiser',
  args: { filters: { championshipId: 'champ-1' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(await canvas.findByText(RESET_LABEL)).toBeInTheDocument()
  },
}

export const SelectStatusTab: Story = {
  name: 'Cliquer un onglet de statut appelle onChange',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: PLAYED_TAB_LABEL }))
    await waitFor(() => expect(args.onChange).toHaveBeenCalledWith({ status: 'PLAYED' }))
  },
}

export const ClickReset: Story = {
  name: 'Cliquer Réinitialiser vide les filtres',
  args: { filters: { championshipId: 'champ-1', status: 'PLAYED' } },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByText(RESET_LABEL))
    await waitFor(() => expect(args.onChange).toHaveBeenCalledWith({}))
  },
}

export const SelectChampionship: Story = {
  name: 'Sélectionner un championnat appelle onChange',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: CHAMPIONSHIP_LABEL }))
    const listbox = await within(document.body).findByRole('listbox')
    await userEvent.click(await within(listbox).findByRole('option', { name: /u13/i }))
    await waitFor(() => expect(args.onChange).toHaveBeenCalledWith({ championshipId: 'champ-1' }))
  },
}
