import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table } from './Table'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { TableFooter } from './TableFooter'
import { TableRow } from './TableRow'
import { TableHead } from './TableHead'
import { TableCell } from './TableCell'
import { TableCaption } from './TableCaption'

function BasicTable() {
  return (
    <Table>
      <TableCaption>Classement</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Équipe</TableHead>
          <TableHead>Pts</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Équipe A</TableCell>
          <TableCell>18</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>18</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

describe('Table', () => {
  it('sets data-slot="table"', () => {
    const { container } = render(<BasicTable />)
    expect(container.querySelector('[data-slot="table"]')).toBeInTheDocument()
  })

  it('renders as table element', () => {
    render(<BasicTable />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('forwards className', () => {
    const { container } = render(<Table className="custom" />)
    expect(container.querySelector('[data-slot="table"]')).toHaveClass('custom')
  })
})

describe('TableHeader', () => {
  it('sets data-slot="table-header"', () => {
    const { container } = render(<Table><TableHeader /></Table>)
    expect(container.querySelector('[data-slot="table-header"]')).toBeInTheDocument()
  })
})

describe('TableBody', () => {
  it('sets data-slot="table-body"', () => {
    const { container } = render(<Table><TableBody /></Table>)
    expect(container.querySelector('[data-slot="table-body"]')).toBeInTheDocument()
  })
})

describe('TableRow', () => {
  it('sets data-slot="table-row"', () => {
    const { container } = render(<Table><TableBody><TableRow /></TableBody></Table>)
    expect(container.querySelector('[data-slot="table-row"]')).toBeInTheDocument()
  })
})

describe('TableHead', () => {
  it('sets data-slot="table-head"', () => {
    const { container } = render(<Table><TableHeader><TableRow><TableHead>Col</TableHead></TableRow></TableHeader></Table>)
    expect(container.querySelector('[data-slot="table-head"]')).toBeInTheDocument()
  })
})

describe('TableCell', () => {
  it('sets data-slot="table-cell"', () => {
    const { container } = render(<Table><TableBody><TableRow><TableCell>Val</TableCell></TableRow></TableBody></Table>)
    expect(container.querySelector('[data-slot="table-cell"]')).toBeInTheDocument()
  })

  it('renders cell content', () => {
    render(<Table><TableBody><TableRow><TableCell>Équipe A</TableCell></TableRow></TableBody></Table>)
    expect(screen.getByText('Équipe A')).toBeInTheDocument()
  })
})

describe('TableCaption', () => {
  it('sets data-slot="table-caption"', () => {
    const { container } = render(<Table><TableCaption>Cap</TableCaption></Table>)
    expect(container.querySelector('[data-slot="table-caption"]')).toBeInTheDocument()
  })

  it('renders caption text', () => {
    render(<Table><TableCaption>Classement général</TableCaption></Table>)
    expect(screen.getByText('Classement général')).toBeInTheDocument()
  })
})
