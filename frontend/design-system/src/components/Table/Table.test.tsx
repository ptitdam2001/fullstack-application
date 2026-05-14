import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table } from './Table'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { TableRow } from './TableRow'
import { TableHead } from './TableHead'
import { TableCell } from './TableCell'
import { TableCaption } from './TableCaption'

function BasicTable() {
  return (
    <Table aria-label="Classement">
      <TableHeader>
        <TableHead>Équipe</TableHead>
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
})

describe('TableHeader', () => {
  it('sets data-slot="table-header"', () => {
    const { container } = render(
      <Table aria-label="test">
        <TableHeader>
          <TableHead>Col</TableHead>
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
        <TableHeader><TableHead>Col</TableHead></TableHeader>
        <TableBody />
      </Table>
    )
    expect(container.querySelector('[data-slot="table-body"]')).toBeInTheDocument()
  })
})

describe('TableRow', () => {
  it('sets data-slot="table-row"', () => {
    const { container } = render(
      <Table aria-label="test">
        <TableHeader><TableHead>Col</TableHead></TableHeader>
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
          <TableHead>Col</TableHead>
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
        <TableHeader><TableHead>Col</TableHead></TableHeader>
        <TableBody>
          <TableRow><TableCell>Val</TableCell></TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('[data-slot="table-cell"]')).toBeInTheDocument()
  })

  it('renders cell content', () => {
    render(
      <Table aria-label="test">
        <TableHeader><TableHead>Col</TableHead></TableHeader>
        <TableBody>
          <TableRow><TableCell>Équipe A</TableCell></TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByText('Équipe A')).toBeInTheDocument()
  })
})

describe('TableCaption', () => {
  it('sets data-slot="table-caption"', () => {
    const { container } = render(<table><TableCaption>Cap</TableCaption></table>)
    expect(container.querySelector('[data-slot="table-caption"]')).toBeInTheDocument()
  })

  it('renders caption text', () => {
    render(<table><TableCaption>Classement général</TableCaption></table>)
    expect(screen.getByText('Classement général')).toBeInTheDocument()
  })
})
