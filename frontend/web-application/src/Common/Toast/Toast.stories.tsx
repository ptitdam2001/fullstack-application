import { Meta } from '@storybook/react-vite'
import Toast from './Toast'

const meta = {
  title: 'Common/Toast',
  parameters: {
    layout: 'fullscreen',
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

export const Simple = () => {
  const toast = Toast.useToast()

  return <button onClick={() => toast('One toast')}>Notify me</button>
}
