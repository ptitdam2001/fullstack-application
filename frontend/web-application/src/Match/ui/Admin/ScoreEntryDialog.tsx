import { FormattedMessage, useIntl } from 'react-intl'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  NumberField,
} from '@repo/design-system'
import { createFormFactory } from '@repo/form-factory'
import { MatchStatus, ScoreEntrySchema } from '../../domain/Match'
import type { Match, MatchTeamSummary, ScoreEntryValues } from '../../domain/Match'
import { useMatchScoreForm } from '../../application/useMatchScoreForm'

const scoreEntryFormFactory = createFormFactory({ schema: ScoreEntrySchema })

type Props = {
  match: Match
  open: boolean
  onOpenChange: (open: boolean) => void
  onFinish?: VoidFunction
}

const formatDate = (date: string | null | undefined, locale: string) =>
  date ? new Date(date).toLocaleDateString(locale) : null

const TeamRow = ({ team }: { team: MatchTeamSummary | null | undefined }) => (
  <div className="flex items-center gap-2">
    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: team?.color ?? '#9ca3af' }} aria-hidden />
    <span>{team?.name ?? <FormattedMessage id="adminMatches.card.teamTbd" />}</span>
  </div>
)

export const ScoreEntryDialog = ({ match, open, onOpenChange, onFinish }: Props) => {
  const intl = useIntl()
  const hasScore = match.status === MatchStatus.PLAYED
  const { form, Field, Form } = scoreEntryFormFactory.useForm({
    defaultValues: { homeGoals: match.homeGoals ?? 0, awayGoals: match.awayGoals ?? 0 },
    mode: 'all',
  })
  const { submitScore, isPending } = useMatchScoreForm(match)
  const scheduledDate = formatDate(match.scheduledAt, intl.locale)

  const onSubmit = async (data: ScoreEntryValues) => {
    await submitScore(data)
    onFinish?.()
  }

  const isValid = form.formState.isValid

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id={hasScore ? 'adminMatches.card.editScore' : 'adminMatches.card.enterScore'} />
            </DialogTitle>
            <DialogDescription className="pt-1">
              {match.stageName}
              {scheduledDate && ` · ${scheduledDate}`}
            </DialogDescription>
          </DialogHeader>
          <Form name="scoreEntryForm" onSubmit={onSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex items-center justify-between gap-4">
              <TeamRow team={match.homeTeam} />
              <Field name="homeGoals">
                {({ field, fieldState }) => (
                  <NumberField
                    label={intl.formatMessage({ id: 'adminMatches.scoreDialog.homeGoals' })}
                    value={field.value}
                    onChange={field.onChange}
                    minValue={0}
                    isInvalid={fieldState.invalid}
                    className="w-28"
                  />
                )}
              </Field>
            </div>
            <div className="flex items-center justify-between gap-4">
              <TeamRow team={match.awayTeam} />
              <Field name="awayGoals">
                {({ field, fieldState }) => (
                  <NumberField
                    label={intl.formatMessage({ id: 'adminMatches.scoreDialog.awayGoals' })}
                    value={field.value}
                    onChange={field.onChange}
                    minValue={0}
                    isInvalid={fieldState.invalid}
                    className="w-28"
                  />
                )}
              </Field>
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" onPress={() => onOpenChange(false)} isDisabled={isPending}>
                <FormattedMessage id="adminMatches.scoreDialog.cancel" />
              </Button>
              <Button type="submit" isDisabled={!isValid || isPending}>
                <FormattedMessage id="adminMatches.scoreDialog.submit" />
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
