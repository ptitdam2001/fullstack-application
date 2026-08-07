import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import { WizardProgress } from './WizardProgress'

const meta = {
  component: WizardProgress,
  title: 'Championship/WizardProgress',
  args: {
    currentStep: 2,
    canGoNext: false,
    onStepClick: fn(),
  },
} satisfies Meta<typeof WizardProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Étape 3 en cours (saison + catégorie faites)',
}

export const ClickCompletedStep: Story = {
  name: 'Cliquer une étape déjà validée appelle onStepClick',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: /season|saison/i }))
    expect(args.onStepClick).toHaveBeenCalledWith(0)
  },
}

export const NextStepDisabledWithoutCanGoNext: Story = {
  name: 'Étape suivante non cliquable tant que canGoNext=false',
  args: { canGoNext: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(await canvas.findByRole('button', { name: /phase 1/i })).toBeDisabled()
  },
}

export const NextStepClickableWithCanGoNext: Story = {
  name: 'Étape suivante cliquable quand canGoNext=true',
  args: { canGoNext: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: /phase 1/i }))
    expect(args.onStepClick).toHaveBeenCalledWith(3)
  },
}
