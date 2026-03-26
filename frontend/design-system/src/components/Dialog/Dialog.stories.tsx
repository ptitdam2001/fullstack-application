import type { Meta, StoryObj } from "@storybook/react-vite";

import { Dialog } from "./Dialog";
import { DialogContent } from "./DialogContent";
import { DialogDescription } from "./DialogDescription";
import { DialogFooter } from "./DialogFooter";
import { DialogHeader } from "./DialogHeader";
import { DialogTitle } from "./DialogTitle";
import { DialogTrigger } from "./DialogTrigger";

const meta = {
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 text-sm border rounded">Open dialog</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">Dialog body content goes here.</p>
        </div>
        <DialogFooter>
          <button className="px-4 py-2 text-sm border rounded">Cancel</button>
          <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded">Save</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 text-sm border rounded">Open dialog</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Information</DialogTitle>
          <DialogDescription>This dialog has no footer.</DialogDescription>
        </DialogHeader>
        <p className="text-sm">Content here.</p>
      </DialogContent>
    </Dialog>
  ),
};
