import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'

import { Button } from '../Button/Button'
import { DialogContent } from './DialogContent'
import { DialogDescription } from './DialogDescription'
import { DialogFooter } from './DialogFooter'
import { DialogHeader } from './DialogHeader'
import { DialogTitle } from './DialogTitle'

const meta = {
  component: DialogContent,
} satisfies Meta<typeof DialogContent>

export default meta

type Story = StoryObj<typeof meta>

/**
 * DialogContent can be controlled directly with `open`/`onOpenChange`, without
 * wrapping it in `<Dialog>` (a DialogTrigger). Use this when the dialog is opened
 * from an element outside the dialog itself (e.g. a table row "Delete" button):
 * a DialogTrigger without a pressable child makes react-aria warn.
 */
const ControlledWithoutTriggerExample = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" onPress={() => setOpen(true)}>
        Delete area
      </Button>
      <DialogContent open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Delete area</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onPress={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  )
}

export const ControlledWithoutTrigger: Story = {
  render: () => <ControlledWithoutTriggerExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()

    await userEvent.click(await canvas.findByRole('button', { name: 'Delete area' }))
    await expect(within(document.body).getByRole('dialog', { name: 'Delete area' })).toBeVisible()

    await userEvent.click(within(document.body).getByRole('button', { name: 'Cancel' }))
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Delete area' }))
    await expect(within(document.body).getByRole('dialog')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}
