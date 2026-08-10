import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'

import { Button } from '../Button/Button'
import { SheetContent } from './SheetContent'
import { SheetHeader } from './SheetHeader'
import { SheetTitle } from './SheetTitle'

const meta = {
  component: SheetContent,
} satisfies Meta<typeof SheetContent>

export default meta

type Story = StoryObj<typeof meta>

/**
 * SheetContent can be controlled directly with `open`/`onOpenChange`, without
 * wrapping it in `<Sheet>` (a DialogTrigger). Use this when the sheet is opened
 * from an element outside the sheet itself (e.g. a table row "Edit" button),
 * matching react-aria's documented controlled-Modal pattern.
 */
const ControlledWithoutTriggerExample = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" onPress={() => setOpen(true)}>
        Edit team
      </Button>
      <SheetContent open={open} onOpenChange={setOpen} side="right">
        <SheetHeader>
          <SheetTitle>Edit team</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </>
  )
}

export const ControlledWithoutTrigger: Story = {
  render: () => <ControlledWithoutTriggerExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Edit team' }))
    await expect(within(document.body).getByRole('dialog')).toBeVisible()

    await userEvent.click(within(document.body).getByRole('button', { name: /close/i }))
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}