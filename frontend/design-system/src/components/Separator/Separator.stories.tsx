import type { Meta, StoryObj } from '@storybook/react-vite'

import { Separator } from './Separator'

const meta = {
  component: Separator,
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

// ─── Orientations ─────────────────────────────────────────────────────────────

export const Horizontal: Story = {
  decorators: [
    Story => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  decorators: [
    Story => (
      <div className="flex h-16">
        <Story />
      </div>
    ),
  ],
}

// ─── In context ───────────────────────────────────────────────────────────────

export const BetweenTextBlocks: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <p className="text-sm">First section content.</p>
      <Separator />
      <p className="text-sm">Second section content.</p>
    </div>
  ),
}

export const BetweenInlineItems: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-sm">
      <span>Profile</span>
      <Separator orientation="vertical" className="h-4" />
      <span>Settings</span>
      <Separator orientation="vertical" className="h-4" />
      <span>Logout</span>
    </div>
  ),
}

export const WithLabeledSections: Story = {
  render: () => (
    <div className="w-64 space-y-3">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Section A</p>
      <Separator />
      <p className="text-sm">Content for section A.</p>
      <Separator />
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Section B</p>
      <Separator />
      <p className="text-sm">Content for section B.</p>
    </div>
  ),
}
