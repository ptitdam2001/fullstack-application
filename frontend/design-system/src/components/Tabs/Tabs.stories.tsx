import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs } from "./Tabs";
import { TabsContent } from "./TabsContent";
import { TabsList } from "./TabsList";
import { TabsTrigger } from "./TabsTrigger";

const meta = {
  component: Tabs,
  args: { defaultValue: "account" },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} className="w-80">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-muted-foreground">Manage your account settings.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm text-muted-foreground">Change your password here.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: (args) => (
    <Tabs {...args} className="w-80">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password" disabled>Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account content</TabsContent>
      <TabsContent value="settings">Settings content</TabsContent>
    </Tabs>
  ),
};
