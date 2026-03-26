import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./Label";

const meta = {
  component: Label,
  args: { children: "Label text" },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHtmlFor: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="input-id">Email address</Label>
      <input id="input-id" type="email" placeholder="email@example.com" className="border rounded px-2 py-1 text-sm" />
    </div>
  ),
};
