import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Grid } from './Grid'
import type { GridRootProps } from './GridRoot'

type Product = { id: string; name: string; price: string }

const TypedGridRoot = Grid.Root as React.ComponentType<GridRootProps<Product>>

const meta = {
  component: TypedGridRoot,
} satisfies Meta<typeof TypedGridRoot>

export default meta

type Story = StoryObj<typeof meta>

const products: Product[] = [
  { id: '1', name: 'Aardvark Mug', price: '$12' },
  { id: '2', name: 'Cat Poster', price: '$8' },
  { id: '3', name: 'Dog Plushie', price: '$24' },
  { id: '4', name: 'Kangaroo Tote', price: '$18' },
  { id: '5', name: 'Panda Sticker', price: '$3' },
  { id: '6', name: 'Snake Print', price: '$15' },
  { id: '7', name: 'Tiger Cap', price: '$22' },
  { id: '8', name: 'Whale Tee', price: '$30' },
]

const children = ({ id, name, price }: Product) => (
  <Grid.Item id={id} textValue={name}>
    <div className="bg-card text-card-foreground flex h-full flex-col justify-between rounded-md border p-3">
      <span className="text-sm font-medium">{name}</span>
      <span className="text-muted-foreground text-xs">{price}</span>
    </div>
  </Grid.Item>
)

export const Default: Story = {
  args: {
    'aria-label': 'Products',
    items: products,
    className: 'h-80 w-[600px]',
    layoutOptions: { minItemSize: { width: 160, height: 120 } },
    children,
  },
}

export const Ghost: Story = {
  args: {
    ...Default.args,
    variant: 'ghost',
  },
}

const largeProducts: Product[] = Array.from({ length: 2000 }, (_, i) => ({
  id: String(i),
  name: `Product ${i + 1}`,
  price: `$${(i % 50) + 1}`,
}))

export const LargeGrid: Story = {
  args: {
    'aria-label': 'Large grid',
    items: largeProducts,
    className: 'h-96 w-[800px]',
    layoutOptions: { minItemSize: { width: 180, height: 140 } },
    children: ({ id, name, price }: Product) => (
      <Grid.Item id={id} textValue={name}>
        <div className="bg-card text-card-foreground flex h-full flex-col justify-between rounded-md border p-3">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-muted-foreground text-xs">{price}</span>
        </div>
      </Grid.Item>
    ),
  },
}

export const WithSelection: Story = {
  args: {
    'aria-label': 'Selectable products',
    items: products,
    selectionMode: 'multiple',
    defaultSelectedKeys: ['2', '4'],
    className: 'h-80 w-[600px]',
    layoutOptions: { minItemSize: { width: 160, height: 120 } },
    children,
  },
}

export const KeyboardNavigation: Story = {
  args: { ...Default.args },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const listbox = canvas.getByRole('listbox')
    await userEvent.click(listbox)
    await userEvent.keyboard('{ArrowRight}')
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
