import { expect, within, userEvent } from 'storybook/test'
import { ThemeToggle } from './ThemeToggle'
import { ThemeProvider } from '../../providers/ThemeProvider/ThemeProvider'
import { type Meta, type StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof ThemeToggle> = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  decorators: [
    Story => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ThemeToggle>

export const Default: Story = {}

export const WithCustomClass: Story = {
  args: { className: 'border border-border' },
}

export const CyclesModes: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // Initial state: system mode (default)
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('Current theme:'))

    // Click once — moves to next mode
    await userEvent.click(button)
    expect(button).toBeInTheDocument()

    // Click again
    await userEvent.click(button)
    expect(button).toBeInTheDocument()

    // Click again — back to first mode
    await userEvent.click(button)
    expect(button).toBeInTheDocument()
  },
}
