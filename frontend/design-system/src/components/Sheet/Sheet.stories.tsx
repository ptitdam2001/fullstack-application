import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../Button/Button'
import { Sheet } from './Sheet'
import { SheetContent } from './SheetContent'
import { SheetDescription } from './SheetDescription'
import { SheetFooter } from './SheetFooter'
import { SheetHeader } from './SheetHeader'
import { SheetTitle } from './SheetTitle'

const meta = {
  component: Sheet,
} satisfies Meta<typeof Sheet>

export default meta

type Story = StoryObj<typeof meta>

const defaultChildren = (
  <>
    <Button variant="outline">Open sheet</Button>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>Make changes to your profile here. Click save when done.</SheetDescription>
      </SheetHeader>
      <div className="py-4">
        <p className="text-muted-foreground text-sm">Sheet content goes here.</p>
      </div>
      <SheetFooter>
        <Button slot="close" variant="outline">Cancel</Button>
        <Button slot="close">Save changes</Button>
      </SheetFooter>
    </SheetContent>
  </>
)

export const Right: Story = {
  args: { children: defaultChildren },
}

export const Left: Story = {
  args: {
    children: (
      <>
        <Button variant="outline">Open left sheet</Button>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Browse through sections.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </>
    ),
  },
}

export const Bottom: Story = {
  args: {
    children: (
      <>
        <Button variant="outline">Open bottom sheet</Button>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Bottom sheet</SheetTitle>
            <SheetDescription>Useful for mobile actions.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </>
    ),
  },
}

// ─── Interaction tests ────────────────────────────────────────────────────────

export const OpensOnClick: Story = {
  args: { children: defaultChildren },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /open sheet/i }))
    await expect(within(document.body).getByRole('dialog')).toBeVisible()
  },
}

export const ClosesOnEscape: Story = {
  args: { children: defaultChildren },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /open sheet/i }))
    await expect(within(document.body).getByRole('dialog')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}
