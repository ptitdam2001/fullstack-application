import { act, render } from '@testing-library/react'
import { Drawer } from './Drawer'
import userEvent from '@testing-library/user-event'

const testId = 'Drawer'
const args = {
  title: 'My title left',
  content: <div data-testid="myContent">My Content</div>,
  testId,
}

const onOpenChange = vi.hoisted(() => vi.fn())

beforeEach(() => {
  onOpenChange.mockClear()
})

it('shows toggle button when drawer is closed', () => {
  const { getByTestId } = render(<Drawer {...args} />)

  expect(getByTestId(`${testId}--toggle`)).toBeInTheDocument()
})

it('is closed by default', () => {
  const { getByTestId } = render(<Drawer {...args} />)

  expect(getByTestId(testId)).toHaveClass('-translate-x-full')
})

it('opens the drawer on button click and hide the toggle button', async () => {
  const { getByTestId, queryAllByTestId } = render(<Drawer {...args} />)

  expect(getByTestId(`${testId}--toggle`)).toBeInTheDocument()

  await act(async () => await userEvent.click(getByTestId(`${testId}--toggle`)))

  expect(getByTestId(testId)).toHaveClass('w-64')

  expect(await queryAllByTestId(`${testId}--toggle`)).toHaveLength(0)

  expect(getByTestId(`${testId}--close`)).toBeInTheDocument()

  await act(async () => await userEvent.click(getByTestId(`${testId}--close`)))

  expect(getByTestId(`${testId}--toggle`)).toBeInTheDocument()
  expect(getByTestId(testId)).not.toHaveClass('w-64')
})

it('call onOpenChange when it is defined and user opens or close the drawer', async () => {
  const hydrateArgs = { ...args, onOpenChange }
  const { getByTestId } = render(<Drawer {...hydrateArgs} />)

  expect(getByTestId(`${testId}--toggle`)).toBeInTheDocument()

  await act(async () => await userEvent.click(getByTestId(`${testId}--toggle`)))

  expect(getByTestId(testId)).toHaveClass('w-64')

  expect(onOpenChange).toHaveBeenCalledWith(true)
  onOpenChange.mockClear()

  expect(getByTestId(`${testId}--close`)).toBeInTheDocument()

  await act(async () => await userEvent.click(getByTestId(`${testId}--close`)))

  expect(onOpenChange).toHaveBeenCalledWith(false)
})
