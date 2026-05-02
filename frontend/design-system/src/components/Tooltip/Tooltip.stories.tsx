import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tooltip } from './Tooltip'
import { TooltipContent } from './TooltipContent'
import { TooltipTrigger } from './TooltipTrigger'

const meta = {
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <button className="rounded border px-3 py-1.5 text-sm">Hover me</button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const TopSide: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <button className="rounded border px-3 py-1.5 text-sm">Top tooltip</button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Appears above</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const BottomSide: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <button className="rounded border px-3 py-1.5 text-sm">Bottom tooltip</button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Appears below</p>
      </TooltipContent>
    </Tooltip>
  ),
}

// ─── Interaction tests ────────────────────────────────────────────────────────

export const HoverShowsTooltip: Story = {
  render: () => (
    <Tooltip delay={0}>
      <TooltipTrigger>
        <button className="rounded border px-3 py-1.5 text-sm">Hover me</button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.hover(canvas.getByRole('button', { name: /hover me/i }))
    await expect(within(document.body).getByRole('tooltip')).toBeVisible()
  },
}

export const UnhoverHidesTooltip: Story = {
  render: () => (
    <Tooltip delay={0}>
      <TooltipTrigger>
        <button className="rounded border px-3 py-1.5 text-sm">Hover me</button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /hover me/i })
    await userEvent.hover(button)
    await expect(within(document.body).getByRole('tooltip')).toBeVisible()
    await userEvent.unhover(button)
    await expect(within(document.body).queryByRole('tooltip')).not.toBeInTheDocument()
  },
}

export const FocusShowsTooltip: Story = {
  render: () => (
    <Tooltip delay={0}>
      <TooltipTrigger>
        <button className="rounded border px-3 py-1.5 text-sm">Tab to me</button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Focused tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('button', { name: /tab to me/i }).focus()
    await expect(within(document.body).getByRole('tooltip')).toBeVisible()
  },
}
