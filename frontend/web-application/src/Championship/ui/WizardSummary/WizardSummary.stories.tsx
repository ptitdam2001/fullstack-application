import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import { WizardSummary } from './WizardSummary'

const meta = {
  component: WizardSummary,
  title: 'Championship/WizardSummary',
  args: {
    lines: [
      { key: 'season', labelId: 'championshipWizard.summary.season', value: '2025–2026' },
      { key: 'category', labelId: 'championshipWizard.summary.category', value: 'U13 · Féminin' },
      { key: 'name', labelId: 'championshipWizard.summary.name', value: null },
    ],
    onJump: fn(),
  },
} satisfies Meta<typeof WizardSummary>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Résumé partiellement rempli',
}

export const ClickLine: Story = {
  name: 'Cliquer une ligne appelle onJump avec son index',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const seasonLine = await canvas.findByText('2025–2026')
    await userEvent.click(seasonLine)
    expect(args.onJump).toHaveBeenCalledWith(0)
  },
}
