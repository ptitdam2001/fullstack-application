import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronsUpDown } from "lucide-react";

import { Collapsible } from "./Collapsible";
import { CollapsibleContent } from "./CollapsibleContent";
import { CollapsibleTrigger } from "./CollapsibleTrigger";

const meta = {
  component: Collapsible,
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-64">
      <div className="flex items-center justify-between px-4">
        <h4 className="text-sm font-semibold">Repositories</h4>
        <CollapsibleTrigger asChild>
          <button className="rounded p-1 hover:bg-accent">
            <ChevronsUpDown className="size-4" />
            <span className="sr-only">Toggle</span>
          </button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 text-sm mt-2">@radix-ui/react-collapsible</div>
      <CollapsibleContent className="space-y-2 mt-2">
        <div className="rounded-md border px-4 py-2 text-sm">@radix-ui/react-dialog</div>
        <div className="rounded-md border px-4 py-2 text-sm">@radix-ui/react-dropdown-menu</div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-64">
      <div className="flex items-center justify-between px-4">
        <h4 className="text-sm font-semibold">Open by default</h4>
        <CollapsibleTrigger asChild>
          <button className="rounded p-1 hover:bg-accent">
            <ChevronsUpDown className="size-4" />
          </button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2">
        <div className="rounded-md border px-4 py-2 text-sm">Visible content</div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
