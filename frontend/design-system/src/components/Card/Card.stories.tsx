import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "./Card";

const meta = {
  component: Card.Container,
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card.Container>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Compositions ─────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Card.Container>
      <Card.Header>
        <Card.Title>Card title</Card.Title>
        <Card.Description>A short description of the card.</Card.Description>
      </Card.Header>
      <Card.Content>
        <p>Main content goes here.</p>
      </Card.Content>
      <Card.Footer>
        <span className="text-sm text-muted-foreground">Footer text</span>
      </Card.Footer>
    </Card.Container>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card.Container>
      <Card.Header>
        <Card.Title>Card with action</Card.Title>
        <Card.Description>The action is placed in the top-right corner.</Card.Description>
        <Card.Action>
          <button className="text-sm underline">Edit</button>
        </Card.Action>
      </Card.Header>
      <Card.Content>
        <p>Content area.</p>
      </Card.Content>
    </Card.Container>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card.Container>
      <Card.Header>
        <Card.Title>Header only</Card.Title>
        <Card.Description>This card has no content or footer.</Card.Description>
      </Card.Header>
    </Card.Container>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card.Container>
      <Card.Content>
        <p>A card with only a content section and no header or footer.</p>
      </Card.Content>
    </Card.Container>
  ),
};

export const WithFooterActions: Story = {
  render: () => (
    <Card.Container>
      <Card.Header>
        <Card.Title>Confirm action</Card.Title>
        <Card.Description>This operation cannot be undone.</Card.Description>
      </Card.Header>
      <Card.Content>
        <p>Are you sure you want to proceed?</p>
      </Card.Content>
      <Card.Footer>
        <div className="flex gap-2">
          <button className="text-sm font-medium">Cancel</button>
          <button className="text-sm font-medium text-destructive">Confirm</button>
        </div>
      </Card.Footer>
    </Card.Container>
  ),
};
