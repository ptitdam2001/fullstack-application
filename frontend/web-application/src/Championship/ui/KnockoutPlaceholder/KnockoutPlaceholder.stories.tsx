import type { Meta, StoryObj } from '@storybook/react-vite'
import { KnockoutPlaceholder } from './KnockoutPlaceholder'

const meta = {
  component: KnockoutPlaceholder,
  title: 'Championship/KnockoutPlaceholder',
} satisfies Meta<typeof KnockoutPlaceholder>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'Bracket non disponible' }
