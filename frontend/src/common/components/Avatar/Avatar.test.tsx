import { render } from '@Testing'
import Avatar from './Avatar'
import { faker } from '@faker-js/faker'
import { userEvent } from '@testing-library/user-event'

const userConfig = userEvent.setup()

it('shows an image when src is defined', () => {
  const { getByTestId } = render(<Avatar imgSrc={faker.image.avatar()} data-testid="avatar" />)

  expect(getByTestId('avatar--img')).toBeInTheDocument()
})

it('shows an incon when src is not defined', () => {
  const { getByTestId } = render(<Avatar data-testid="avatar" />)

  expect(getByTestId('avatar--icon')).toBeInTheDocument()
})

it('is possible to trigger a click with onClick callback', async () => {
  const onClick = vi.fn()

  const { getByTestId } = render(<Avatar data-testid="avatar" onClick={onClick} />)

  await userConfig.click(getByTestId('avatar--icon'))

  expect(onClick).toHaveBeenCalledOnce()
})
