import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Selector } from './Selector'
import { Card } from '@Components/Card'

const meta = {
  title: 'Common/Input/Selector',
  component: Selector.Container,
  tags: ['autodocs'],
} satisfies Meta<typeof Selector.Container>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onChange: fn(),
    children: (
      <>
        <Selector.Option id="1" selected>
          <Card className="h-10">Option 1 </Card>
        </Selector.Option>
        <Selector.Option id="2">
          <Card className="h-10">Option 2 </Card>
        </Selector.Option>
        <Selector.Option id="3">
          <Card className="h-10">Option 3 </Card>
        </Selector.Option>
        <Selector.Option id="4">
          <Card className="h-10">Option 4 </Card>
        </Selector.Option>
      </>
    ),
  },
}

export const Disabled: Story = {
  args: {
    onChange: fn(),
    disabled: true,
    children: (
      <>
        <Selector.Option id="1" selected>
          Option 1
        </Selector.Option>
        <Selector.Option id="2">Option 2</Selector.Option>
        <Selector.Option id="3">Option 3</Selector.Option>
        <Selector.Option id="4">Option 4</Selector.Option>
      </>
    ),
  },
}

export const SimpleGroup: Story = {
  args: {
    onChange: fn(),
    children: (
      <>
        <Selector.Option id="1" selected>
          Option 1
        </Selector.Option>
        <Selector.Group label="Group 1">
          <Selector.Option id="2">Option 2</Selector.Option>
          <Selector.Option id="3">Option 3</Selector.Option>
          <Selector.Option id="4">Option 4</Selector.Option>
          <Selector.Group label="subGroup 1">
            <Selector.Option id="5">Option 5</Selector.Option>
          </Selector.Group>
        </Selector.Group>
      </>
    ),
  },
}

export const WithSelectableGroup: Story = {
  args: {
    onChange: fn(),
    children: (
      <>
        <Selector.Option id="1" selected>
          Option 1
        </Selector.Option>
        <Selector.Group label="Group 1">
          <Selector.Option id="2">Option 2</Selector.Option>
          <Selector.Option id="3">Option 3</Selector.Option>
          <Selector.Option id="4">Option 4</Selector.Option>
          <Selector.OptionGroup id="2-2" label="subGroup 1">
            <Selector.Option id="5">Option 5</Selector.Option>
          </Selector.OptionGroup>
        </Selector.Group>
      </>
    ),
  },
}
