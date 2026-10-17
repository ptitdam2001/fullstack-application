import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table } from './Table'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { TableFooter } from './TableFooter'
import { TableRow } from './TableRow'
import { TableHead } from './TableHead'
import { TableCell } from './TableCell'

function BasicTable(props: Omit<React.ComponentProps<typeof Table>, 'children'>) {
  return (
    <Table aria-label="Classement" {...props}>
      <TableHeader>
        <TableHead isRowHeader>Équipe</TableHead>
        <TableHead>Pts</TableHead>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Équipe A</TableCell>
          <TableCell>18</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

describe('Table', () => {
  it('sets data-slot="table"', () => {
    const { container } = render(<BasicTable />)
    expect(container.querySelector('[data-slot="table"]')).toBeInTheDocument()
  })

  it('renders as grid or table element', () => {
    render(<BasicTable />)
    const el = screen.queryByRole('grid') ?? screen.queryByRole('table')
    expect(el).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<Table aria-label="test" className="custom" />)
    expect(container.querySelector('[data-slot="table"]')).toHaveClass('custom')
  })

  it('renders no caption without the caption prop', () => {
    const { container } = render(<BasicTable />)
    expect(container.querySelector('[data-slot="table-caption"]')).not.toBeInTheDocument()
    expect(screen.getByRole('grid')).toHaveAccessibleDescription('')
  })

  it('renders the caption next to the rows', () => {
    const { container } = render(<BasicTable caption="Classement général" />)
    expect(container.querySelector('[data-slot="table-caption"]')).toHaveTextContent('Classement général')
    expect(screen.getByRole('rowheader', { name: 'Équipe A' })).toBeInTheDocument()
  })

  it('describes the table by its caption', () => {
    render(<BasicTable caption="Classement général" />)
    expect(screen.getByRole('grid')).toHaveAccessibleDescription('Classement général')
  })

  it('keeps the aria-describedby of the caller', () => {
    render(
      <>
        <p id="note">Mis à jour hier</p>
        <BasicTable caption="Classement général" aria-describedby="note" />
      </>
    )
    expect(screen.getByRole('grid')).toHaveAccessibleDescription('Mis à jour hier Classement général')
  })
})

describe('TableHeader', () => {
  it('sets data-slot="table-header"', () => {
    const { container } = render(
      <Table aria-label="test">
        <TableHeader>
          <TableHead isRowHeader>Col</TableHead>
        </TableHeader>
        <TableBody />
      </Table>
    )
    expect(container.querySelector('[data-slot="table-header"]')).toBeInTheDocument()
  })
})

describe('TableBody', () => {
  it('sets data-slot="table-body"', () => {
    const { container } = render(
      <Table aria-label="test">
        <TableHeader>
          <TableHead isRowHeader>Col</TableHead>
        </TableHeader>
        <TableBody />
      </Table>
    )
    expect(container.querySelector('[data-slot="table-body"]')).toBeInTheDocument()
  })
})

describe('TableFooter', () => {
  const FooterTable = () => (
    <Table aria-label="test">
      <TableHeader>
        <TableHead isRowHeader>Équipe</TableHead>
        <TableHead>Pts</TableHead>
      </TableHeader>
      <TableBody>
        <TableRow id="a">
          <TableCell>Équipe A</TableCell>
          <TableCell>25</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow id="total">
          <TableCell>Total</TableCell>
          <TableCell>48</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )

  it('sets data-slot="table-footer"', () => {
    const { container } = render(<FooterTable />)
    expect(container.querySelector('[data-slot="table-footer"]')).toBeInTheDocument()
  })

  it('renders its rows after the body rows', () => {
    render(<FooterTable />)
    const rowHeaders = screen.getAllByRole('rowheader').map(cell => cell.textContent)
    expect(rowHeaders).toEqual(['Équipe A', 'Total'])
    expect(screen.getByText('48')).toBeInTheDocument()
  })
})

describe('TableRow', () => {
  it('sets data-slot="table-row"', () => {
    const { container } = render(
      <Table aria-label="test">
        <TableHeader>
          <TableHead isRowHeader>Col</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Val</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('[data-slot="table-row"]')).toBeInTheDocument()
  })
})

describe('TableHead', () => {
  it('sets data-slot="table-head"', () => {
    const { container } = render(
      <Table aria-label="test">
        <TableHeader>
          <TableHead isRowHeader>Col</TableHead>
        </TableHeader>
        <TableBody />
      </Table>
    )
    expect(container.querySelector('[data-slot="table-head"]')).toBeInTheDocument()
  })
})

describe('TableCell', () => {
  it('sets data-slot="table-cell"', () => {
    const { container } = render(
      <Table aria-label="test">
        <TableHeader>
          <TableHead isRowHeader>Col</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Val</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('[data-slot="table-cell"]')).toBeInTheDocument()
  })

  it('renders cell content', () => {
    render(
      <Table aria-label="test">
        <TableHeader>
          <TableHead isRowHeader>Col</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Équipe A</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByText('Équipe A')).toBeInTheDocument()
  })

  it('renders the cells of the isRowHeader column as row headers', () => {
    render(<BasicTable />)
    expect(screen.getByRole('rowheader', { name: 'Équipe A' })).toBeInTheDocument()
  })
})
