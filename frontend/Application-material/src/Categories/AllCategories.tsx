import { Table } from '@Common/Table/Table'
import { CircularProgress } from '@mui/material'
import { useGetCategories } from '@Spotify/generated/sdk'
import { Link } from 'react-router-dom'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

export const AllCategories = () => {
  const { data, isLoading } = useGetCategories()

  return isLoading ? (
    <CircularProgress />
  ) : (
    <Table.TableContainer>
      <Table.TableCaption>A list of your recent invoices.</Table.TableCaption>
      <Table.TableHeader>
        <Table.TableRow>
          <Table.TableHead>Icon</Table.TableHead>
          <Table.TableHead>Name</Table.TableHead>
          <Table.TableHead className="w-[100px]"></Table.TableHead>
        </Table.TableRow>
      </Table.TableHeader>
      <Table.TableBody>
        {data?.categories.items?.map(category => (
          <Table.TableRow key={category.id}>
            <Table.TableCell>
              {category.icons.map(icon => (
                <img
                  key={icon.url}
                  srcSet={icon.url}
                  src={icon.url}
                  alt={category.name}
                  loading="lazy"
                  height={icon.height ?? 50}
                  width={icon.width ?? 50}
                />
              ))}
            </Table.TableCell>
            <Table.TableCell>{category.name}</Table.TableCell>
            <Table.TableCell>
              <Link to={`${category.id}`}>
                <KeyboardArrowRightIcon />
              </Link>
            </Table.TableCell>
          </Table.TableRow>
        ))}
      </Table.TableBody>
    </Table.TableContainer>
  )
}
