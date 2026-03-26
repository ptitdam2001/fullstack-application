import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Trash2 } from "lucide-react";

import { Button } from "./Button";

const meta = {
  component: Button,
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Variants ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: { children: "Button" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost" },
};

export const Link: Story = {
  args: { variant: "link", children: "Link" },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Small: Story = {
  args: { size: "sm", children: "Small" },
};

export const Large: Story = {
  args: { size: "lg", children: "Large" },
};

export const Icon: Story = {
  args: { size: "icon", children: <Trash2 /> },
};

// ─── States ───────────────────────────────────────────────────────────────────

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Trash2 />
        Delete
      </>
    ),
  },
};

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};

// ─── Interaction tests ────────────────────────────────────────────────────────

export const ClickCallsHandler: Story = {
  args: { children: "Click me" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /click me/i });

    await userEvent.click(button);

    expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const MultipleClicks: Story = {
  args: { children: "Click me" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /click me/i });

    await userEvent.click(button);
    await userEvent.click(button);
    await userEvent.click(button);

    expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

export const DisabledDoesNotFire: Story = {
  args: { children: "Disabled", disabled: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /disabled/i });

    await userEvent.click(button);

    expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const KeyboardActivation: Story = {
  args: { children: "Press Enter" },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /press enter/i });

    button.focus();
    await userEvent.keyboard("{Enter}");

    expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const FocusVisible: Story = {
  args: { children: "Tab to me" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /tab to me/i });

    await userEvent.tab();

    expect(button).toHaveFocus();
  },
};
