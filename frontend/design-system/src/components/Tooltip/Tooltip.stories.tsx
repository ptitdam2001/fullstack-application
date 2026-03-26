import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tooltip } from "./Tooltip";
import { TooltipContent } from "./TooltipContent";
import { TooltipTrigger } from "./TooltipTrigger";

const meta = {
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="px-3 py-1.5 text-sm border rounded">Hover me</button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const TopSide: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="px-3 py-1.5 text-sm border rounded">Top tooltip</button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Appears above</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const BottomSide: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="px-3 py-1.5 text-sm border rounded">Bottom tooltip</button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>Appears below</p>
      </TooltipContent>
    </Tooltip>
  ),
};
