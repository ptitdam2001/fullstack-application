import { Table } from '@Common/Table/table'

export const Team = () => (
  <Table.TableContainer>
    <Table.TableCaption>A list of your recent invoices.</Table.TableCaption>
    <Table.TableHeader>
      <Table.TableRow>
        <Table.TableHead className="w-[100px]">Invoice</Table.TableHead>
        <Table.TableHead>Status</Table.TableHead>
        <Table.TableHead>Method</Table.TableHead>
        <Table.TableHead className="text-right">Amount</Table.TableHead>
      </Table.TableRow>
    </Table.TableHeader>
    <Table.TableBody>
      <Table.TableRow>
        <Table.TableCell className="font-medium">INV001</Table.TableCell>
        <Table.TableCell>Paid</Table.TableCell>
        <Table.TableCell>Credit Card</Table.TableCell>
        <Table.TableCell className="text-right">$250.00</Table.TableCell>
      </Table.TableRow>
    </Table.TableBody>
  </Table.TableContainer>
)
