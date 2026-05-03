import { expect, userEvent, within, waitFor } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../Button/Button'
import { Avatar } from '../Avatar/Avatar'
import { AvatarFallback } from '../Avatar/AvatarFallback'
import { Tooltip } from './Tooltip'

const meta = {
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

// ─── Static stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: <Button variant="outline">Hover me</Button>,
    position: 'top',
  },
}

export const Right: Story = {
  args: {
    content: 'Appears on the right',
    children: <Button variant="outline">Right tooltip</Button>,
    position: 'right',
  },
}

export const Bottom: Story = {
  args: {
    content: 'Appears below',
    children: <Button variant="outline">Bottom tooltip</Button>,
    position: 'bottom',
  },
}

export const Left: Story = {
  args: {
    content: 'Appears on the left',
    children: <Button variant="outline">Left tooltip</Button>,
    position: 'left',
  },
}

export const RichContent: Story = {
  args: {
    content: (
      <div className="flex flex-col gap-1">
        <span className="font-semibold">Jersey #10</span>
        <span>Forward</span>
      </div>
    ),
    children: <Button variant="outline">Rich content</Button>,
    position: 'top',
  },
}

// ─── Children variants ────────────────────────────────────────────────────────

// Note: native elements don't read FocusableContext from react-aria,
// so tooltip only works with react-aria components (Button) as trigger.
export const WithNativeButton: Story = {
  args: {
    content: 'Tooltip on native button (visual only)',
    children: <button className="rounded border px-3 py-1.5 text-sm">Native button</button>,
    position: 'top',
  },
}

export const WithCustomElement: Story = {
  args: {
    content: 'Tooltip on custom element (visual only)',
    children: (
      <div tabIndex={0} className="rounded border px-3 py-1.5 text-sm cursor-pointer">
        Custom div (tabIndex=0)
      </div>
    ),
    position: 'top',
  },
}

export const WithAvatar: Story = {
  args: {
    content: (
      <div className="flex flex-col">
        <span>#10</span>
        <span>Forward</span>
      </div>
    ),
    children: (
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    ),
    position: 'right',
  },
}

// ─── Interaction tests ─────────────────────────────────────────────────────────
// Note: react-aria tooltip shows on keyboard focus. userEvent.hover() does not
// trigger react-aria's hover detection in jsdom/Storybook play context.

export const ShowsTooltipOnFocus: Story = {
  args: {
    content: 'This is a tooltip',
    children: <Button variant="outline">Tab to me</Button>,
    position: 'top',
    delay: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await waitFor(() => expect(canvas.getByRole('button', { name: /tab to me/i })).toHaveFocus())
    await waitFor(() => expect(within(document.body).getByRole('tooltip')).toBeVisible())
  },
}

export const HidesOnBlur: Story = {
  args: {
    content: 'This is a tooltip',
    children: <Button variant="outline">Tab to me</Button>,
    position: 'top',
    delay: 0,
    closeDelay: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await waitFor(() => expect(canvas.getByRole('button', { name: /tab to me/i })).toHaveFocus())
    await waitFor(() => expect(within(document.body).getByRole('tooltip')).toBeVisible())
    // Tab away to blur
    await userEvent.tab()
    await waitFor(() =>
      expect(within(document.body).queryByRole('tooltip')).not.toBeInTheDocument()
    )
  },
}

export const FocusShowsTooltip: Story = {
  args: {
    content: 'Focused tooltip',
    children: <Button variant="outline">Tab to me</Button>,
    position: 'top',
    delay: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: /tab to me/i })).toHaveFocus()
    )
    await waitFor(() => expect(within(document.body).getByRole('tooltip')).toBeVisible())
  },
}

export const DisabledShowsNothing: Story = {
  args: {
    content: 'This should not appear',
    children: <Button variant="outline">Disabled tooltip</Button>,
    position: 'top',
    delay: 0,
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: /disabled tooltip/i })).toHaveFocus()
    )
    await expect(within(document.body).queryByRole('tooltip')).not.toBeInTheDocument()
  },
}
