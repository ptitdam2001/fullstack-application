import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { PopoverContent } from './PopoverContent'
import { PopoverTrigger } from './PopoverTrigger'
import { Popover } from './Popover'

const meta = {
  component: Popover,
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

const defaultChildren = (
  <>
    <PopoverTrigger>
      {triggerProps => (
        <button {...triggerProps} className="rounded border px-3 py-1.5 text-sm">
          Open popover
        </button>
      )}
    </PopoverTrigger>
    <PopoverContent>
      <p className="text-sm">Popover content goes here.</p>
    </PopoverContent>
  </>
)

export const Default: Story = {
  args: { children: defaultChildren },
}

export const WithForm: Story = {
  args: {
    children: (
      <>
        <PopoverTrigger>
          {triggerProps => (
            <button {...triggerProps} className="rounded border px-3 py-1.5 text-sm">
              Open form
            </button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">Dimensions</h4>
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs">Width</label>
              <input className="rounded border px-2 py-1 text-sm" defaultValue="100%" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground text-xs">Max width</label>
              <input className="rounded border px-2 py-1 text-sm" defaultValue="300px" />
            </div>
          </div>
        </PopoverContent>
      </>
    ),
  },
}

export const Opens: Story = {
  args: { children: defaultChildren },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Open popover' }))
    await expect(within(document.body).getByRole('dialog')).toBeVisible()
  },
}

export const ClosesOnEscape: Story = {
  args: { children: defaultChildren },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Open popover' }))
    await expect(within(document.body).getByRole('dialog')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}

export const ClosesOnOutsideClick: Story = {
  args: { children: defaultChildren },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Open popover' }))
    await expect(within(document.body).getByRole('dialog')).toBeVisible()
    await userEvent.click(document.body)
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}
