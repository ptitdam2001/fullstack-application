import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CreditCard, LogOut, Mail, MessageSquare, Settings, User, UserPlus } from 'lucide-react'

import { Button } from '../Button/Button'
import { DropdownMenu } from './DropdownMenu'
import { DropdownMenuCheckboxItem } from './DropdownMenuCheckboxItem'
import { DropdownMenuContent } from './DropdownMenuContent'
import { DropdownMenuGroup } from './DropdownMenuGroup'
import { DropdownMenuItem } from './DropdownMenuItem'
import { DropdownMenuLabel } from './DropdownMenuLabel'
import { DropdownMenuRadioGroup } from './DropdownMenuRadioGroup'
import { DropdownMenuRadioItem } from './DropdownMenuRadioItem'
import { DropdownMenuSeparator } from './DropdownMenuSeparator'
import { DropdownMenuShortcut } from './DropdownMenuShortcut'
import { DropdownMenuSub } from './DropdownMenuSub'
import { DropdownMenuSubContent } from './DropdownMenuSubContent'
import { DropdownMenuSubTrigger } from './DropdownMenuSubTrigger'

const meta = {
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <Button variant="outline">Open menu</Button>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard />
              <span>Billing</span>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOut />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </>
    ),
  },
}

export const WithSubMenu: Story = {
  args: {
    children: (
      <>
        <Button variant="outline">With submenu</Button>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserPlus />
                <span>Invite users</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Mail />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare />
                  <span>Message</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </>
    ),
  },
}

export const WithCheckboxItems: Story = {
  args: {
    children: (
      <>
        <Button variant="outline">Checkboxes</Button>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked>Status Bar</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Activity Bar</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Panel</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </>
    ),
  },
}

export const WithRadioItems: Story = {
  args: {
    children: (
      <>
        <Button variant="outline">Radio items</Button>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Panel position</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="top">
            <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </>
    ),
  },
}

// ─── Interaction tests ────────────────────────────────────────────────────────

export const OpensOnClick: Story = {
  args: { ...Default.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /open menu/i }))
    await expect(within(document.body).getByRole('menu')).toBeVisible()
  },
}

export const ClosesOnEscape: Story = {
  args: { ...Default.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /open menu/i }))
    await expect(within(document.body).getByRole('menu')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(within(document.body).queryByRole('menu')).not.toBeInTheDocument()
  },
}

export const ClosesOnOutsideClick: Story = {
  args: { ...Default.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /open menu/i }))
    await expect(within(document.body).getByRole('menu')).toBeVisible()
    await userEvent.click(document.body)
    await expect(within(document.body).queryByRole('menu')).not.toBeInTheDocument()
  },
}

export const KeyboardNavigation: Story = {
  args: { ...Default.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /open menu/i }))
    const menu = within(document.body).getByRole('menu')
    await expect(menu).toBeVisible()
    await userEvent.keyboard('{ArrowDown}')
    const items = within(document.body).getAllByRole('menuitem')
    await expect(items[0]).toHaveFocus()
  },
}
