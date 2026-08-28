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
} from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import type { Match } from '../../domain/Match'

type Props = {
  match: Match
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

const formatDate = (date: string | null | undefined, locale: string) =>
  date ? new Date(date).toLocaleDateString(locale) : null

export const DeleteMatchDialog = ({ match, open, onOpenChange, onConfirm, isPending }: Props) => {
  const intl = useIntl()
  const teamTbd = intl.formatMessage({ id: 'adminMatches.card.teamTbd' })
  const homeTeam = match.homeTeam?.name ?? teamTbd
  const awayTeam = match.awayTeam?.name ?? teamTbd
  const date = formatDate(match.scheduledAt, intl.locale)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id="adminMatches.deleteDialog.title" />
            </DialogTitle>
            <DialogDescription className="pt-3 pb-5">
              <FormattedMessage id="adminMatches.deleteDialog.description" values={{ homeTeam, awayTeam, date }} />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onPress={() => onOpenChange(false)} isDisabled={isPending}>
              <FormattedMessage id="adminMatches.deleteDialog.cancel" />
            </Button>
            <Button variant="destructive" onPress={onConfirm} isDisabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <FormattedMessage id="adminMatches.deleteDialog.confirm" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
