import type { Meta, StoryObj } from '@storybook/react-vite'

import { Typography } from './Typography'

const meta = {
  component: Typography,
  tags: ['autodocs'],
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography.Title1>Title 1 — text-3xl bold</Typography.Title1>
      <Typography.Title2>Title 2 — text-2xl semibold</Typography.Title2>
      <Typography.Title3>Title 3 — text-xl semibold</Typography.Title3>
      <Typography.Subtitle>Subtitle — text-lg medium</Typography.Subtitle>
      <Typography.Body>Body (default) — text-base</Typography.Body>
      <Typography.BodySmall>Body Small — text-sm</Typography.BodySmall>
      <Typography.Caption>Caption — text-xs medium</Typography.Caption>
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Typography.Body color="default">Default color (text-foreground)</Typography.Body>
      <Typography.Body color="muted">Muted color (text-muted-foreground)</Typography.Body>
      <Typography.Body color="primary">Primary color (text-primary)</Typography.Body>
      <Typography.Body color="destructive">Destructive color (text-destructive)</Typography.Body>
    </div>
  ),
}

export const ColorsOnTitle: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Typography.Title2 color="default">Default title</Typography.Title2>
      <Typography.Title2 color="muted">Muted title</Typography.Title2>
      <Typography.Title2 color="primary">Primary title</Typography.Title2>
      <Typography.Title2 color="destructive">Destructive title</Typography.Title2>
    </div>
  ),
}