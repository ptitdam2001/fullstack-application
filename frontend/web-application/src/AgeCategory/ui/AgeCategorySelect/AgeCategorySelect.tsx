import { Select, SelectItem } from '@repo/design-system'
import { FormattedMessage, useIntl } from 'react-intl'
import { useAllAgeCategories } from '../../application/useAllAgeCategories'

type Props = {
  label?: string
  value: string | null | undefined
  onChange: (value: string | null) => void
}

export const AgeCategorySelect = ({ label, value, onChange }: Props) => {
  const intl = useIntl()
  const ageCategories = useAllAgeCategories()

  return (
    <Select
      label={label ?? intl.formatMessage({ id: 'adminTeams.form.ageCategoryId' })}
      selectedKey={value ?? ''}
      onSelectionChange={key => onChange(key === '' ? null : (key as string))}
    >
      <SelectItem id="">{intl.formatMessage({ id: 'adminTeams.form.ageCategoryId.none' })}</SelectItem>
      {ageCategories.map(ac => (
        <SelectItem key={ac.id} id={ac.id}>
          {ac.label} - <FormattedMessage id={`adminAgeCategories.genre.${ac.genre}`} />
        </SelectItem>
      ))}
    </Select>
  )
}
