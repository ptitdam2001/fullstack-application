import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Tabs } from './Tabs'
import { TabsContent } from './TabsContent'
import { TabsList } from './TabsList'
import { TabsTrigger } from './TabsTrigger'

const meta = {
  component: Tabs,
  args: { defaultValue: 'account' },
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <Tabs {...args} className="w-80">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-muted-foreground text-sm">Manage your account settings.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-muted-foreground text-sm">Change your password here.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const WithDisabledTab: Story = {
  render: args => (
    <Tabs {...args} className="w-80">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password" disabled>
          Password
        </TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account content</TabsContent>
      <TabsContent value="settings">Settings content</TabsContent>
    </Tabs>
  ),
}

export const SelectTabOnClick: Story = {
  render: args => (
    <Tabs {...args} className="w-80">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-muted-foreground text-sm">Manage your account settings.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-muted-foreground text-sm">Change your password here.</p>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const passwordTab = canvas.getByRole('tab', { name: /password/i })
    await userEvent.click(passwordTab)
    expect(passwordTab).toHaveAttribute('aria-selected', 'true')
    expect(canvas.getByText('Change your password here.')).toBeVisible()
  },
}

export const KeyboardNavigation: Story = {
  render: args => (
    <Tabs {...args} className="w-80">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-muted-foreground text-sm">Manage your account settings.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-muted-foreground text-sm">Change your password here.</p>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const accountTab = canvas.getByRole('tab', { name: /account/i })
    const passwordTab = canvas.getByRole('tab', { name: /password/i })
    await userEvent.tab()
    expect(accountTab).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    expect(passwordTab).toHaveFocus()
    expect(passwordTab).toHaveAttribute('aria-selected', 'true')
    expect(canvas.getByText('Change your password here.')).toBeVisible()
  },
}
