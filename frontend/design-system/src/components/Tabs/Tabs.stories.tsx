import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Tabs } from './Tabs'
import { TabPanel } from './TabPanel'
import { TabPanels } from './TabPanels'
import { TabList } from './TabList'
import { Tab } from './Tab'

const meta = {
  component: Tabs,
  args: { defaultSelectedKey: 'account' },
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <Tabs {...args} className="w-80">
      <TabList aria-label="Settings">
        <Tab id="account">Account</Tab>
        <Tab id="password">Password</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="account">
          <p className="text-muted-foreground text-sm">Manage your account settings.</p>
        </TabPanel>
        <TabPanel id="password">
          <p className="text-muted-foreground text-sm">Change your password here.</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  ),
}

export const WithDisabledTab: Story = {
  render: args => (
    <Tabs {...args} className="w-80">
      <TabList aria-label="Settings">
        <Tab id="account">Account</Tab>
        <Tab id="password" isDisabled>
          Password
        </Tab>
        <Tab id="settings">Settings</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="account">Account content</TabPanel>
        <TabPanel id="settings">Settings content</TabPanel>
      </TabPanels>
    </Tabs>
  ),
}

export const VerticalOrientation: Story = {
  render: args => (
    <Tabs {...args} orientation="vertical" className="w-80">
      <TabList aria-label="Settings">
        <Tab id="account">Account</Tab>
        <Tab id="password">Password</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="account">
          <p className="text-muted-foreground text-sm">Manage your account settings.</p>
        </TabPanel>
        <TabPanel id="password">
          <p className="text-muted-foreground text-sm">Change your password here.</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  ),
}

export const SelectTabOnClick: Story = {
  render: args => (
    <Tabs {...args} className="w-80">
      <TabList aria-label="Settings">
        <Tab id="account">Account</Tab>
        <Tab id="password">Password</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="account">
          <p className="text-muted-foreground text-sm">Manage your account settings.</p>
        </TabPanel>
        <TabPanel id="password">
          <p className="text-muted-foreground text-sm">Change your password here.</p>
        </TabPanel>
      </TabPanels>
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
      <TabList aria-label="Settings">
        <Tab id="account">Account</Tab>
        <Tab id="password">Password</Tab>
      </TabList>
      <TabPanels>
        <TabPanel id="account">
          <p className="text-muted-foreground text-sm">Manage your account settings.</p>
        </TabPanel>
        <TabPanel id="password">
          <p className="text-muted-foreground text-sm">Change your password here.</p>
        </TabPanel>
      </TabPanels>
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
