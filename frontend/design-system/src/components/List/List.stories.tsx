import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { List } from './List'
import type { ListRootProps } from './ListRoot'

type Animal = { id: string; name: string }

const TypedListRoot = List.Root as React.ComponentType<ListRootProps<Animal>>

const meta = {
  component: TypedListRoot,
} satisfies Meta<typeof TypedListRoot>

export default meta

type Story = StoryObj<typeof meta>
const animals: Animal[] = [
  { id: '1', name: 'Aardvark' },
  { id: '2', name: 'Cat' },
  { id: '3', name: 'Dog' },
  { id: '4', name: 'Kangaroo' },
  { id: '5', name: 'Panda' },
  { id: '6', name: 'Snake' },
  { id: '7', name: 'Tiger' },
  { id: '8', name: 'Whale' },
]

const children = ({ id, name }: Animal) => <List.Item id={id}>{name}</List.Item>

export const Default: Story = {
  args: {
    'aria-label': 'Animals',
    items: animals,
    className: 'h-64 w-72',
    children,
  },
}

export const GhostVariant: Story = {
  args: {
    ...Default.args,
    variant: 'ghost',
  },
}

const largeItems: Animal[] = Array.from({ length: 5000 }, (_, i) => ({ id: String(i), name: `Item ${i + 1}` }))

export const LargeList: Story = {
  args: {
    'aria-label': 'Large list',
    items: largeItems,
    className: 'h-80 w-72',
    children,
  },
}

export const WithSelection: Story = {
  args: {
    'aria-label': 'Selectable animals',
    items: animals,
    selectionMode: 'multiple',
    defaultSelectedKeys: ['2', '4'],
    className: 'h-64 w-72',
    children,
  },
}

export const CustomRowSize: Story = {
  args: {
    'aria-label': 'Animals with large rows',
    items: animals,
    layoutOptions: { rowHeight: 64 },
    className: 'h-64 w-72',
    children,
  },
}

// ─── Interaction tests ──────────────────────────────────────────────────────

export const KeyboardNavigation: Story = {
  args: { ...Default.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const listbox = canvas.getByRole('listbox')
    await userEvent.click(listbox)
    await userEvent.keyboard('{ArrowDown}')
    const options = canvas.getAllByRole('option')
    await expect(options[0]).toHaveFocus()
  },
}

export const SelectionWithKeyboard: Story = {
  args: { ...WithSelection.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const options = canvas.getAllByRole('option')
    await userEvent.click(options[0])
    await expect(options[0]).toHaveAttribute('aria-selected', 'true')
  },
}
