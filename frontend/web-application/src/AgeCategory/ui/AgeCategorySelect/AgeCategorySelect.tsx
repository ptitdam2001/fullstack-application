import { Select, SelectItem } from '@repo/design-system'
import { useIntl } from 'react-intl'
import { useGetAgeCategories } from '../../infrastructure/useAgeCategoryApi'

type Props = {
  label?: string
  value: string | null | undefined
  onChange: (value: string | null) => void
}

export const AgeCategorySelect = ({ label, value, onChange }: Props) => {
  const intl = useIntl()
  const { data } = useGetAgeCategories({ page: 1, count: 100 })
  const ageCategories = (data ?? []) as Array<{ id: string; label: string }>

  return (
    <Select
      label={label ?? intl.formatMessage({ id: 'adminTeams.form.ageCategoryId' })}
      selectedKey={value ?? ''}
      onSelectionChange={(key) => onChange(key === '' ? null : (key as string))}
    >
      <SelectItem id="">{intl.formatMessage({ id: 'adminTeams.form.ageCategoryId.none' })}</SelectItem>
      {ageCategories.map((ac) => (
        <SelectItem key={ac.id} id={ac.id}>
          {ac.label}
        </SelectItem>
      ))}
    </Select>
  )
}