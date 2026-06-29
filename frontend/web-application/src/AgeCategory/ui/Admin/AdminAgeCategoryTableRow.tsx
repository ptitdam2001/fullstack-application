import { Button } from '@repo/design-system'
import { Pencil, Trash2 } from 'lucide-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Table } from '@Common/Table/Table'
import type { AgeCategory } from '../../domain/AgeCategory'

type AdminAgeCategoryTableRowProps = {
  ageCategory: AgeCategory
  onEdit: (id: string) => void
  onDelete: (ageCategory: AgeCategory) => void
}

export const AdminAgeCategoryTableRow = ({ ageCategory, onEdit, onDelete }: AdminAgeCategoryTableRowProps) => {
  const intl = useIntl()

  return (
    <Table.TableRow>
      <Table.TableCell className="font-medium">{ageCategory.label}</Table.TableCell>
      <Table.TableCell>
        <FormattedMessage id={`adminAgeCategories.genre.${ageCategory.genre}`} />
      </Table.TableCell>
      <Table.TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label={intl.formatMessage({ id: 'adminAgeCategories.action.edit' })}
            onPress={() => onEdit(ageCategory.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label={intl.formatMessage({ id: 'adminAgeCategories.action.delete' })}
            onPress={() => onDelete(ageCategory)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Table.TableCell>
    </Table.TableRow>
  )
}
