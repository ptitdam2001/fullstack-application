import { act, render } from '@testing-library/react'
import { Drawer } from './Drawer'
import userEvent from '@testing-library/user-event'

const testId = 'Drawer'

const onOpenChange = vi.hoisted(() => vi.fn())

beforeEach(() => {
  onOpenChange.mockClear()
})

const CustomDawerOpener = () => {
  const handleClick = Drawer.useDrawerToggleOpen()
  return (
    <button onClick={handleClick} data-testid="openBtn">
      Open
    </button>
  )
}

const component = (
  <Drawer.Container onVisibilityChange={onOpenChange} position="left">
    <CustomDawerOpener />
    <Drawer.Content testId="Drawer">
      {toggleClose => (
        <div>
          <div data-testid="myContent">My drawer content</div>
          <button onClick={toggleClose} data-testid="closeBtn">
            Close
          </button>
        </div>
      )}
    </Drawer.Content>
  </Drawer.Container>
)

it('opens the drawer on button click and hide the toggle button', async () => {
  const { getByTestId } = render(component)

  expect(getByTestId(`openBtn`)).toBeInTheDocument()

  await act(async () => await userEvent.click(getByTestId(`openBtn`)))

  expect(getByTestId(testId + '--content')).toHaveClass('w-64')

  expect(getByTestId(`closeBtn`)).toBeInTheDocument()

  await act(async () => await userEvent.click(getByTestId(`closeBtn`)))

  expect(getByTestId(testId + '--content')).not.toHaveClass('w-64')
})

it('call onVisibilityChange when it is defined and user opens or close the drawer', async () => {
  const { getByTestId } = render(component)

  expect(getByTestId(`openBtn`)).toBeInTheDocument()

  await act(async () => await userEvent.click(getByTestId(`openBtn`)))

  expect(onOpenChange).toHaveBeenCalledWith(true)
  onOpenChange.mockClear()

  await act(async () => await userEvent.click(getByTestId(`closeBtn`)))

  expect(onOpenChange).toHaveBeenCalledWith(false)
})
