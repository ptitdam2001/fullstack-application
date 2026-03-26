import type { Meta, StoryObj } from "@storybook/react-vite";

import { Popover } from "./Popover";
import { PopoverContent } from "./PopoverContent";
import { PopoverTrigger } from "./PopoverTrigger";

const meta = {
  component: Popover,
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <button className="px-3 py-1.5 text-sm border rounded">Open popover</button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm">Popover content goes here.</p>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <button className="px-3 py-1.5 text-sm border rounded">Open form</button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold">Dimensions</h4>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Width</label>
            <input className="border rounded px-2 py-1 text-sm" defaultValue="100%" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Max width</label>
            <input className="border rounded px-2 py-1 text-sm" defaultValue="300px" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
