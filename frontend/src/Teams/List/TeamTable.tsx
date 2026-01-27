import { Button } from '@/components/ui/button'
import { Table } from '@Common/Table/Table'
import { Team } from '@Sdk/model'
import { Eye, Pencil, Users, Volleyball } from 'lucide-react'
import { Link } from 'react-router'

type TeamTableProps = {
  teams: Team[]
}
export const TeamTable = ({ teams }: TeamTableProps) => {
  return (
    <Table.TableContainer>
      <Table.TableHeader>
        <Table.TableHead>Name</Table.TableHead>
        <Table.TableHead className="w-12">Color</Table.TableHead>
        <Table.TableHead className="w-40">Actions</Table.TableHead>
      </Table.TableHeader>
      <Table.TableBody>
        {teams?.map(team => (
          <Table.TableRow key={team.id}>
            <Table.TableCell>{team.name}</Table.TableCell>
            <Table.TableCell>
              <Volleyball style={{ color: team.color ?? 'inherit', width: '2rem', height: '2rem' }} />
            </Table.TableCell>
            <Table.TableCell>
              <Button variant="outline" size="icon" aria-label="More" color="primary" asChild>
                <Link to={`/app/team/${team.id}`}>
                  <Eye />
                </Link>
              </Button>
              <Button variant="outline" size="icon" aria-label="Players" color="primary" asChild>
                <Link to={`/app/team/${team.id}/players`}>
                  <Users />
                </Link>
              </Button>

              <Button variant="outline" size="icon" aria-label="Edit" color="primary" asChild>
                <Link to={`${team.id}/edit`}>
                  <Pencil />
                </Link>
              </Button>
            </Table.TableCell>
          </Table.TableRow>
        ))}
      </Table.TableBody>
    </Table.TableContainer>
  )
}
