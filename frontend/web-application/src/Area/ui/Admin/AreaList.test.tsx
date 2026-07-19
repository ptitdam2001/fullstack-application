import { render, screen, fireEvent } from '@testing-library/react'
import type { Area } from '../../domain/Area'
import { AreaList } from './AreaList'

// React 19 use() checks .status synchronously — plain Promise.resolve() suspends on first render
function fulfilledPromise<T>(value: T): Promise<T> {
  const p = Promise.resolve(value) as Promise<T> & { status: string; value: T }
  p.status = 'fulfilled'
  p.value = value
  return p
}

vi.mock('../../application/useAreaList', () => ({
  useAreaList: vi.fn(),
}))

import { useAreaList } from '../../application/useAreaList'

const mockedUseAreaList = vi.mocked(useAreaList)

const areas: Area[] = [
  { id: '1', name: 'Stade A', address: '1 rue du Stade', city: 'Paris', longitude: 2.35, latitude: 48.85 },
  { id: '2', name: 'Stade B', address: '2 rue du Stade', city: 'Lyon', longitude: 4.83, latitude: 45.75 },
]

const mockUseAreaList = (data: Area[], count: number) => {
  mockedUseAreaList.mockReturnValue({
    query: { promise: fulfilledPromise(data) },
    countQuery: { promise: fulfilledPromise(count) },
    pagination: { page: 0, rowsPerPage: 25 },
    changePage: vi.fn(),
    changeRowsPerPage: vi.fn(),
  } as never)
}

describe('AreaList', () => {
  it('renders table header', () => {
    mockUseAreaList(areas, areas.length)
    render(<AreaList />)
    expect(screen.getByText('adminAreas.table.address')).toBeInTheDocument()
  })

  it('renders a row for each area', () => {
    mockUseAreaList(areas, areas.length)
    render(<AreaList />)
    expect(screen.getByText('Stade A')).toBeInTheDocument()
    expect(screen.getByText('Stade B')).toBeInTheDocument()
  })

  it('renders empty state when list is empty', () => {
    mockUseAreaList([], 0)
    render(<AreaList />)
    expect(screen.getByText('adminAreas.table.empty')).toBeInTheDocument()
  })

  it('does not render actions column when actions prop is omitted', () => {
    mockUseAreaList(areas, areas.length)
    render(<AreaList />)
    expect(screen.queryByText('adminAreas.table.actions')).not.toBeInTheDocument()
  })

  it('renders actions and forwards clicks', () => {
    mockUseAreaList(areas, areas.length)
    const onAction = vi.fn()
    render(<AreaList actions={area => <button onClick={() => onAction(area.id)}>action-{area.id}</button>} />)

    expect(screen.getByText('adminAreas.table.actions')).toBeInTheDocument()
    fireEvent.click(screen.getByText('action-1'))
    expect(onAction).toHaveBeenCalledWith('1')
  })
})
