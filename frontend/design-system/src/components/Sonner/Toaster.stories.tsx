import type { Meta, StoryObj } from '@storybook/react-vite'
import { toast } from 'sonner'

import { Toaster } from './Toaster'

const meta = {
  component: Toaster,
  decorators: [
    Story => (
      <>
        <Story />
        <button
          onClick={() => toast('Event has been created.')}
          className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm"
        >
          Show toast
        </button>
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSuccess: Story = {
  decorators: [
    Story => (
      <>
        <Story />
        <button
          onClick={() => toast.success('Changes saved successfully.')}
          className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm"
        >
          Show success toast
        </button>
      </>
    ),
  ],
}

export const WithError: Story = {
  decorators: [
    Story => (
      <>
        <Story />
        <button
          onClick={() => toast.error('Something went wrong.')}
          className="bg-destructive text-destructive-foreground rounded px-4 py-2 text-sm"
        >
          Show error toast
        </button>
      </>
    ),
  ],
}
