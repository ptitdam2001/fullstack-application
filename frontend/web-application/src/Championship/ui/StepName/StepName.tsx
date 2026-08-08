import { FormattedMessage, useIntl } from 'react-intl'
import { TextInputField, Typography } from '@repo/design-system'

type StepNameProps = {
  name: string
  onChange: (name: string) => void
  categoryLabel?: string
  categoryGenreLabel?: string
  seasonYear?: string
}

export const StepName = ({ name, onChange, categoryLabel, categoryGenreLabel, seasonYear }: StepNameProps) => {
  const intl = useIntl()

  const placeholder =
    categoryLabel && seasonYear
      ? intl.formatMessage(
          { id: 'championshipWizard.step.name.placeholder' },
          { categoryLabel, genreLabel: categoryGenreLabel ?? '', seasonYear }
        )
      : intl.formatMessage({ id: 'championshipWizard.step.name.placeholderDefault' })

  return (
    <div>
      <Typography.Title2>
        <FormattedMessage id="championshipWizard.step.name" />
      </Typography.Title2>
      <Typography.Body className="text-muted-foreground mb-5">
        <FormattedMessage id="championshipWizard.step.name.hint" />
      </Typography.Body>

      <TextInputField
        label={intl.formatMessage({ id: 'championshipWizard.step.name.label' })}
        value={name}
        onChange={onChange}
        placeholder={placeholder}
        isRequired
        className="max-w-md"
      />
    </div>
  )
}
