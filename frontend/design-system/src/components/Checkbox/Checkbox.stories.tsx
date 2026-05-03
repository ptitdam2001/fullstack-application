import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Checkbox } from './Checkbox'
import { CheckboxGroup } from './CheckboxGroup'

const meta = {
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Accept terms and conditions' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    await userEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  },
}

export const Checked: Story = {
  args: { children: 'Already checked', defaultSelected: true },
}

export const Indeterminate: Story = {
  args: { children: 'Indeterminate state', isIndeterminate: true },
}

export const Disabled: Story = {
  args: { children: 'Disabled checkbox', isDisabled: true },
}

export const Invalid: Story = {
  args: { children: 'Invalid checkbox', isInvalid: true },
}

export const WithGroup: Story = {
  render: () => (
    <CheckboxGroup label="Rôles">
      <Checkbox value="admin">Admin</Checkbox>
      <Checkbox value="coach">Coach</Checkbox>
      <Checkbox value="referee">Arbitre</Checkbox>
    </CheckboxGroup>
  ),
}

export const KeyboardToggle: Story = {
  args: { children: 'Keyboard toggle' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox')
    await userEvent.tab()
    expect(checkbox).toHaveFocus()
    await userEvent.keyboard(' ')
    expect(checkbox).toBeChecked()
  },
}
