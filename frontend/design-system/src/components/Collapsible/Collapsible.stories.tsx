import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronsUpDown } from 'lucide-react'

import { Collapsible } from './Collapsible'
import { CollapsibleContent } from './CollapsibleContent'
import { CollapsibleTrigger } from './CollapsibleTrigger'

const meta = { component: Collapsible } satisfies Meta<typeof Collapsible>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Collapsible className="w-64">
      <div className="flex items-center justify-between px-4">
        <h4 className="text-sm font-semibold">Repositories</h4>
        <CollapsibleTrigger className="hover:bg-accent rounded p-1" aria-label="Toggle repositories">
          <ChevronsUpDown className="size-4" />
        </CollapsibleTrigger>
      </div>
      <div className="mt-2 rounded-md border px-4 py-2 text-sm">@radix-ui/react-collapsible</div>
      <CollapsibleContent className="mt-2 space-y-2">
        <div className="rounded-md border px-4 py-2 text-sm">@radix-ui/react-dialog</div>
        <div className="rounded-md border px-4 py-2 text-sm">@radix-ui/react-dropdown-menu</div>
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-64">
      <div className="flex items-center justify-between px-4">
        <h4 className="text-sm font-semibold">Open by default</h4>
        <CollapsibleTrigger className="hover:bg-accent rounded p-1" aria-label="Toggle">
          <ChevronsUpDown className="size-4" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2">
        <div className="rounded-md border px-4 py-2 text-sm">Visible content</div>
      </CollapsibleContent>
    </Collapsible>
  ),
}

// ─── Interaction tests ────────────────────────────────────────────────────────

export const TogglesContent: Story = {
  render: () => (
    <Collapsible className="w-64">
      <div className="flex items-center justify-between px-4">
        <h4 className="text-sm font-semibold">Repositories</h4>
        <CollapsibleTrigger className="hover:bg-accent rounded p-1" aria-label="Toggle repositories">
          <ChevronsUpDown className="size-4" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2 space-y-2">
        <div className="rounded-md border px-4 py-2 text-sm">Hidden item</div>
      </CollapsibleContent>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /toggle repositories/i })

    // DisclosurePanel stays in DOM — use visibility check
    await expect(canvas.getByText('Hidden item')).not.toBeVisible()
    await userEvent.click(trigger)
    await expect(canvas.getByText('Hidden item')).toBeVisible()
    await userEvent.click(trigger)
    await expect(canvas.getByText('Hidden item')).not.toBeVisible()
  },
}

export const StartsOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-64">
      <div className="flex items-center justify-between px-4">
        <h4 className="text-sm font-semibold">Open by default</h4>
        <CollapsibleTrigger className="hover:bg-accent rounded p-1" aria-label="Toggle">
          <ChevronsUpDown className="size-4" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2">
        <div className="rounded-md border px-4 py-2 text-sm">Visible content</div>
      </CollapsibleContent>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /toggle/i })

    await expect(canvas.getByText('Visible content')).toBeVisible()
    await userEvent.click(trigger)
    await expect(canvas.getByText('Visible content')).not.toBeVisible()
  },
}
