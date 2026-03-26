import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck, AlertTriangle, Info } from "lucide-react";

import { Badge } from "./Badge";

const meta = {
  component: Badge,
  args: {
    children: "Badge",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Variants ────────────────────────────────────────────────────────────────

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Error" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

// ─── With icons ───────────────────────────────────────────────────────────────

export const WithLeadingIcon: Story = {
  args: {
    children: (
      <>
        <CircleCheck />
        Success
      </>
    ),
    variant: "default",
  },
};

export const WithIconDestructive: Story = {
  args: {
    children: (
      <>
        <AlertTriangle />
        Warning
      </>
    ),
    variant: "destructive",
  },
};

export const WithIconOutline: Story = {
  args: {
    children: (
      <>
        <Info />
        Info
      </>
    ),
    variant: "outline",
  },
};

// ─── asChild ─────────────────────────────────────────────────────────────────

export const AsLink: Story = {
  args: {
    asChild: true,
    variant: "outline",
    children: <a href="#">Link badge</a>,
  },
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};
