import type { Meta, StoryObj } from '@storybook/react-vite'
import { within, userEvent, expect, waitFor } from 'storybook/test'
import { Toast } from './Toast'

const meta = {
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <Toast.Provider>
        <Story />
      </Toast.Provider>
    ),
  ],
} satisfies Meta<unknown>

export default meta
type Story = StoryObj<typeof meta>

const DefaultTrigger = () => {
  const notify = Toast.useToast()
  return <button onClick={() => notify('Event has been created.')}>Show toast</button>
}

export const Default: Story = {
  render: () => <DefaultTrigger />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(() => {
      expect(within(document.body).getByText('Event has been created.')).toBeInTheDocument()
    })
  },
}

const SuccessTrigger = () => {
  const notify = Toast.useToast()
  return <button onClick={() => notify.success('Changes saved successfully.')}>Show success</button>
}

export const Success: Story = {
  render: () => <SuccessTrigger />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(() => {
      expect(within(document.body).getByText('Changes saved successfully.')).toBeInTheDocument()
    })
  },
}

const ErrorTrigger = () => {
  const notify = Toast.useToast()
  return <button onClick={() => notify.error('Something went wrong.')}>Show error</button>
}

export const Error: Story = {
  render: () => <ErrorTrigger />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(() => {
      expect(within(document.body).getByText('Something went wrong.')).toBeInTheDocument()
    })
  },
}

const WarningTrigger = () => {
  const notify = Toast.useToast()
  return <button onClick={() => notify.warning('This action cannot be undone.')}>Show warning</button>
}

export const Warning: Story = {
  render: () => <WarningTrigger />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(() => {
      expect(within(document.body).getByText('This action cannot be undone.')).toBeInTheDocument()
    })
  },
}

const LoadingTrigger = () => {
  const notify = Toast.useToast()
  return <button onClick={() => notify.loading('Uploading file...')}>Show loading</button>
}

export const Loading: Story = {
  render: () => <LoadingTrigger />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(() => {
      expect(within(document.body).getByText('Uploading file...')).toBeInTheDocument()
    })
  },
}

const WithDescriptionTrigger = () => {
  const notify = Toast.useToast()
  return (
    <button
      onClick={() =>
        notify('Scheduled: Catch up', {
          description: 'Friday, February 10, 2023 at 5:57 PM',
        })
      }
    >
      Show with description
    </button>
  )
}

export const WithDescription: Story = {
  render: () => <WithDescriptionTrigger />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(() => {
      expect(within(document.body).getByText('Scheduled: Catch up')).toBeInTheDocument()
      expect(within(document.body).getByText('Friday, February 10, 2023 at 5:57 PM')).toBeInTheDocument()
    })
  },
}

const TopRightTrigger = () => {
  const notify = Toast.useToast()
  return <button onClick={() => notify('Positioned top right')}>Show toast</button>
}

export const TopRight: Story = {
  decorators: [
    Story => (
      <Toast.Provider value={{ position: 'top-right' }}>
        <Story />
      </Toast.Provider>
    ),
  ],
  render: () => <TopRightTrigger />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(() => {
      expect(within(document.body).getByText('Positioned top right')).toBeInTheDocument()
    })
  },
}
