import type { Meta, StoryObj } from '@storybook/react-vite'
// import { fn } from 'storybook/test'
import { Popover } from './Popover'
import { useState } from 'react'

const meta = {
  title: 'Data Display/Popover',
  component: Popover.Container,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div id="main" className="bg-white-400 w-full h-128 flex justify-center items-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover.Container>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultBottom: Story = {
  args: {
    children: (
      <>
        <Popover.Trigger>Open me</Popover.Trigger>
        <Popover.Content>{() => <div>My content</div>}</Popover.Content>
      </>
    ),
  },
}

export const Top: Story = {
  args: {
    placement: 'top',
    children: (
      <>
        <Popover.Trigger>Open me</Popover.Trigger>
        <Popover.Content>{() => <div>My content</div>}</Popover.Content>
      </>
    ),
  },
}

export const Left: Story = {
  args: {
    placement: 'left',
    children: (
      <>
        <Popover.Trigger>Open me</Popover.Trigger>
        <Popover.Content>{() => <div>My content</div>}</Popover.Content>
      </>
    ),
  },
}

export const Right: Story = {
  args: {
    placement: 'right',
    children: (
      <>
        <Popover.Trigger>Open me</Popover.Trigger>
        <Popover.Content>{() => <div>My content</div>}</Popover.Content>
      </>
    ),
  },
}

export const Controlled = () => {
  const [open, setOpen] = useState(false)
  return (
    <Popover.Container open={open} onOpenChange={setOpen} placement="top">
      <Popover.Trigger
        onClick={() => {
          setOpen(v => !v)
        }}
      >
        My trigger
      </Popover.Trigger>
      <Popover.Content className="p-2 w-10 h-5 flex flex-col content-between">
        {close => (
          <>
            <div>My popover content</div>
            <button onClick={close}>Close</button>
          </>
        )}
      </Popover.Content>
    </Popover.Container>
  )
}
