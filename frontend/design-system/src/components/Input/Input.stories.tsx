import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./Input";

const meta = {
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Enter text..." },
};

export const WithType: Story = {
  args: { type: "email", placeholder: "email@example.com" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "Password" },
};

export const Disabled: Story = {
  args: { placeholder: "Disabled", disabled: true },
};

export const WithValue: Story = {
  args: { defaultValue: "Prefilled value" },
};

export const Invalid: Story = {
  args: { placeholder: "Invalid input", "aria-invalid": true },
};
