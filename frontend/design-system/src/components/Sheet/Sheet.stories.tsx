import type { Meta, StoryObj } from "@storybook/react-vite";

import { Sheet } from "./Sheet";
import { SheetContent } from "./SheetContent";
import { SheetDescription } from "./SheetDescription";
import { SheetFooter } from "./SheetFooter";
import { SheetHeader } from "./SheetHeader";
import { SheetTitle } from "./SheetTitle";
import { SheetTrigger } from "./SheetTrigger";

const meta = {
  component: Sheet,
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <button className="px-4 py-2 text-sm border rounded">Open sheet</button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when done.</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">Sheet content goes here.</p>
        </div>
        <SheetFooter>
          <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded">Save changes</button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <button className="px-4 py-2 text-sm border rounded">Open left sheet</button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Browse through sections.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <button className="px-4 py-2 text-sm border rounded">Open bottom sheet</button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Bottom sheet</SheetTitle>
          <SheetDescription>Useful for mobile actions.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};
