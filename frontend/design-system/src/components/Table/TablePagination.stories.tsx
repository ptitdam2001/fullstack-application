import { expect, fn, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { TablePagination } from './TablePagination'

const meta = {
  component: TablePagination,
  args: {
    count: 100,
    page: 1,
    rowsPerPage: 10,
    onPageChange: fn(),
    onRowsPerPageChange: fn(),
  },
} satisfies Meta<typeof TablePagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FirstPage: Story = {
  args: { page: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttons = canvas.getAllByRole('button')
    expect(buttons[0]).toBeDisabled()
    expect(buttons[1]).not.toBeDisabled()
  },
}

export const LastPage: Story = {
  args: { page: 9 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttons = canvas.getAllByRole('button')
    expect(buttons[0]).not.toBeDisabled()
    expect(buttons[1]).toBeDisabled()
  },
}

export const NextPage: Story = {
  args: { page: 3, onPageChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const buttons = canvas.getAllByRole('button')
    await userEvent.click(buttons[1])
    expect(args.onPageChange).toHaveBeenCalledWith(4)
  },
}

export const PrevPage: Story = {
  args: { page: 3, onPageChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const buttons = canvas.getAllByRole('button')
    await userEvent.click(buttons[0])
    expect(args.onPageChange).toHaveBeenCalledWith(2)
  },
}

export const CustomOptions: Story = {
  args: { rowsPerPageOptions: [5, 20, 50], rowsPerPage: 5 },
}

export const WithoutRowsPerPageChangeHandler: Story = {
  args: { onRowsPerPageChange: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('combobox')).toBeDisabled()
  },
}

export const WithRowsPerPageChangeHandler: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox')
    await expect(select).toBeEnabled()
    await userEvent.selectOptions(select, '50')
    expect(args.onRowsPerPageChange).toHaveBeenCalled()
  },
}
