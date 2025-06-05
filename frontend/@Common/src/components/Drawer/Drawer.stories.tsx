import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Drawer } from './Drawer'

const meta = {
  title: 'Data Display/Drawer',
  component: Drawer.Container,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div className="bg-white-400 w-full h-128">
        <Story />
      </div>
    ),
  ],
  args: {
    onVisibilityChange: fn(),
  },
} satisfies Meta<typeof Drawer.Container>

export default meta
type Story = StoryObj<typeof meta>

const CustomDawerOpener = () => {
  const handleClick = Drawer.useDrawerToggleOpen()
  return <button onClick={handleClick}>Open</button>
}

export const Left: Story = {
  args: {
    position: 'left',
    children: (
      <>
        <CustomDawerOpener />
        <Drawer.Content>
          {toggleClose => (
            <div>
              <p>My drawer content</p>
              <button onClick={toggleClose}>Close</button>
            </div>
          )}
        </Drawer.Content>
      </>
    ),
  },
}

export const Right: Story = {
  args: {
    position: 'right',
    children: (
      <>
        <CustomDawerOpener />
        <Drawer.Content>
          {toggleClose => (
            <div>
              <p>My drawer content</p>
              <button onClick={toggleClose}>Close</button>
            </div>
          )}
        </Drawer.Content>
      </>
    ),
  },
}

export const WithHeader: Story = {
  args: {
    position: 'left',
    children: (
      <>
        <CustomDawerOpener />
        <Drawer.Content>
          {() => (
            <div>
              <Drawer.Header title="Drawer Title" />
              <p>My drawer content</p>
            </div>
          )}
        </Drawer.Content>
      </>
    ),
  },
}

export const WithCustomWidth: Story = {
  args: {
    position: 'left',
    width: 'w-4/6',
    children: (
      <>
        <CustomDawerOpener />
        <Drawer.Content>
          {() => (
            <div>
              <Drawer.Header title="Drawer Title" />
              <p>My drawer content</p>
            </div>
          )}
        </Drawer.Content>
      </>
    ),
  },
}
