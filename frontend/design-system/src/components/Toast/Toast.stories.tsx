import type { Meta, StoryObj } from '@storybook/react-vite'
import { within, userEvent, expect, waitFor } from 'storybook/test'
import { Toast } from './Toast'

const meta = {
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<unknown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const Trigger = () => {
      const notify = Toast.useToast()
      return <button onClick={() => notify('Event has been created.')}>Show toast</button>
    }
    return (
      <Toast.Provider>
        <Trigger />
      </Toast.Provider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(() => {
      expect(within(document.body).getByText('Event has been created.')).toBeInTheDocument()
    })
  },
}

export const Success: Story = {
  render: () => {
    const Trigger = () => {
      const notify = Toast.useToast()
      return <button onClick={() => notify.success('Changes saved successfully.')}>Show success</button>
    }
    return (
      <Toast.Provider>
        <Trigger />
      </Toast.Provider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(() => {
      expect(within(document.body).getByText('Changes saved successfully.')).toBeInTheDocument()
    })
  },
}

export const Error: Story = {
  render: () => {
    const Trigger = () => {
      const notify = Toast.useToast()
      return <button onClick={() => notify.error('Something went wrong.')}>Show error</button>
    }
    return (
      <Toast.Provider>
        <Trigger />
      </Toast.Provider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(() => {
      expect(within(document.body).getByText('Something went wrong.')).toBeInTheDocument()
    })
  },
}

export const Warning: Story = {
  render: () => {
    const Trigger = () => {
      const notify = Toast.useToast()
      return <button onClick={() => notify.warning('This action cannot be undone.')}>Show warning</button>
    }
    return (
      <Toast.Provider>
        <Trigger />
      </Toast.Provider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(() => {
      expect(within(document.body).getByText('This action cannot be undone.')).toBeInTheDocument()
    })
  },
}

export const Loading: Story = {
  render: () => {
    const Trigger = () => {
      const notify = Toast.useToast()
      return <button onClick={() => notify.loading('Uploading file...')}>Show loading</button>
    }
    return (
      <Toast.Provider>
        <Trigger />
      </Toast.Provider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(() => {
      expect(within(document.body).getByText('Uploading file...')).toBeInTheDocument()
    })
  },
}

export const WithDescription: Story = {
  render: () => {
    const Trigger = () => {
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
    return (
      <Toast.Provider>
        <Trigger />
      </Toast.Provider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(() => {
      expect(within(document.body).getByText('Scheduled: Catch up')).toBeInTheDocument()
      expect(within(document.body).getByText('Friday, February 10, 2023 at 5:57 PM')).toBeInTheDocument()
    })
  },
}

export const TopRight: Story = {
  render: () => {
    const Trigger = () => {
      const notify = Toast.useToast()
      return <button onClick={() => notify('Positioned top right')}>Show toast</button>
    }
    return (
      <Toast.Provider value={{ position: 'top-right' }}>
        <Trigger />
      </Toast.Provider>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button'))
    await waitFor(() => {
      expect(within(document.body).getByText('Positioned top right')).toBeInTheDocument()
    })
  },
}
