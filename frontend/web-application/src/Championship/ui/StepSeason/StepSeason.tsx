import { FormattedMessage, useIntl } from 'react-intl'
import { RadioGroup, Radio, Typography, cn } from '@repo/design-system'
import type { Season } from '@Season/domain/Season'

type StepSeasonProps = {
  seasons: Season[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const formatDateRange = (season: Season, intl: ReturnType<typeof useIntl>) => {
  if (!season.startDate || !season.endDate) {
    return intl.formatMessage({ id: 'championshipWizard.step.season.dateRangeUnknown' })
  }
  return intl.formatMessage(
    { id: 'championshipWizard.step.season.dateRange' },
    {
      start: new Date(season.startDate).toLocaleDateString(intl.locale),
      end: new Date(season.endDate).toLocaleDateString(intl.locale),
    }
  )
}

export const StepSeason = ({ seasons, selectedId, onSelect }: StepSeasonProps) => {
  const intl = useIntl()

  return (
    <div>
      <Typography.Title2>
        <FormattedMessage id="championshipWizard.step.season" />
      </Typography.Title2>
      <Typography.Body className="text-muted-foreground mb-5">
        <FormattedMessage id="championshipWizard.step.season.hint" />
      </Typography.Body>

      {seasons.length === 0 ? (
        <Typography.Body className="text-muted-foreground">
          <FormattedMessage id="championshipWizard.step.season.empty" />
        </Typography.Body>
      ) : (
        <RadioGroup
          aria-label={intl.formatMessage({ id: 'championshipWizard.step.season' })}
          value={selectedId ?? ''}
          onChange={onSelect}
          className="gap-2"
        >
          {seasons.map(season => (
            <Radio
              key={season.id}
              value={season.id}
              className={cn(
                'border-border rounded-lg border p-3',
                'hover:bg-secondary',
                'data-selected:border-primary data-selected:bg-secondary'
              )}
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium">{season.label}</span>
                <span className="text-muted-foreground text-xs">{formatDateRange(season, intl)}</span>
              </span>
            </Radio>
          ))}
        </RadioGroup>
      )}
    </div>
  )
}
