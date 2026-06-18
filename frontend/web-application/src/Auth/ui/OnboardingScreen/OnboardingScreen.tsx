import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useIntl, FormattedMessage } from 'react-intl'
import { Button, Layout, Toast } from '@repo/design-system'
import { Loader2 } from 'lucide-react'
import { TeamSelectField } from '@Teams/ui/TeamSelect/TeamSelectField'
import { useDeclareReferee, useCreateTeamJoinRequest, useCreateTeamWithCoach } from '../../infrastructure/useAuthApi'
import { CONNECTED_HOME } from '../../domain/Auth'

export const OnboardingScreen = () => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const navigate = useNavigate()

  const { mutateAsync: declareReferee, isPending: isRefereeLoading } = useDeclareReferee()
  const { mutateAsync: joinRequest, isPending: isJoinLoading } = useCreateTeamJoinRequest()
  const { mutateAsync: createTeam, isPending: isCreateLoading } = useCreateTeamWithCoach()

  const [refereeRegistered, setRefereeRegistered] = useState(false)
  const [joinSent, setJoinSent] = useState(false)
  const [teamCreated, setTeamCreated] = useState(false)

  const [joinTeamId, setJoinTeamId] = useState<string | null>(null)
  const [joinRole, setJoinRole] = useState<'PLAYER' | 'COACH'>('PLAYER')
  const [newTeamName, setNewTeamName] = useState('')

  const handleDeclareReferee = async () => {
    try {
      await declareReferee()
      setRefereeRegistered(true)
      toast(intl.formatMessage({ id: 'onboarding.referee.done' }))
    } catch {
      toast(intl.formatMessage({ id: 'auth.error.generic' }))
    }
  }

  const handleJoinTeam = async () => {
    if (!joinTeamId) {
      return
    }
    try {
      await joinRequest({ teamId: joinTeamId, data: { requestedRole: joinRole } })
      setJoinSent(true)
      toast(intl.formatMessage({ id: 'onboarding.joinTeam.done' }))
    } catch {
      toast(intl.formatMessage({ id: 'auth.error.generic' }))
    }
  }

  const handleCreateTeam = async () => {
    if (!newTeamName) {
      return
    }
    try {
      await createTeam({ data: { name: newTeamName, ageCategory: 'Senior', color: '#000000', areas: [] } })
      setTeamCreated(true)
      toast(intl.formatMessage({ id: 'onboarding.createTeam.done' }))
    } catch {
      toast(intl.formatMessage({ id: 'auth.error.generic' }))
    }
  }

  return (
    <Layout.Root>
      <Layout.Content align="center">
        <div className="w-full max-w-lg space-y-8 py-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              <FormattedMessage id="onboarding.title" />
            </h1>
            <p className="text-slate-500">
              <FormattedMessage id="onboarding.description" />
            </p>
          </div>

          <section className="space-y-4 rounded-lg border p-6">
            <h2 className="font-semibold">
              <FormattedMessage id="onboarding.referee.title" />
            </h2>
            <p className="text-sm text-slate-500">
              <FormattedMessage id="onboarding.referee.description" />
            </p>
            <Button variant="outline" isDisabled={refereeRegistered || isRefereeLoading} onPress={handleDeclareReferee}>
              {isRefereeLoading && <Loader2 className="animate-spin" />}
              <FormattedMessage id={refereeRegistered ? 'onboarding.referee.done' : 'onboarding.referee.action'} />
            </Button>
          </section>

          <section className="space-y-4 rounded-lg border p-6">
            <h2 className="font-semibold">
              <FormattedMessage id="onboarding.joinTeam.title" />
            </h2>
            <p className="text-sm text-slate-500">
              <FormattedMessage id="onboarding.joinTeam.description" />
            </p>
            <div className="space-y-3">
              <TeamSelectField value={joinTeamId ?? undefined} onChange={(key) => setJoinTeamId(key || null)} />
              <select
                value={joinRole}
                onChange={e => setJoinRole(e.target.value as 'PLAYER' | 'COACH')}
                className="w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value="PLAYER">{intl.formatMessage({ id: 'onboarding.joinTeam.role.player' })}</option>
                <option value="COACH">{intl.formatMessage({ id: 'onboarding.joinTeam.role.coach' })}</option>
              </select>
              <Button variant="outline" isDisabled={!joinTeamId || joinSent || isJoinLoading} onPress={handleJoinTeam}>
                {isJoinLoading && <Loader2 className="animate-spin" />}
                <FormattedMessage id={joinSent ? 'onboarding.joinTeam.done' : 'onboarding.joinTeam.action'} />
              </Button>
            </div>
          </section>

          <section className="space-y-4 rounded-lg border p-6">
            <h2 className="font-semibold">
              <FormattedMessage id="onboarding.createTeam.title" />
            </h2>
            <p className="text-sm text-slate-500">
              <FormattedMessage id="onboarding.createTeam.description" />
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                placeholder={intl.formatMessage({ id: 'onboarding.createTeam.field.name' })}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
              <Button
                variant="outline"
                isDisabled={!newTeamName || teamCreated || isCreateLoading}
                onPress={handleCreateTeam}
              >
                {isCreateLoading && <Loader2 className="animate-spin" />}
                <FormattedMessage id={teamCreated ? 'onboarding.createTeam.done' : 'onboarding.createTeam.action'} />
              </Button>
            </div>
          </section>

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              <FormattedMessage id="onboarding.skip.hint" />
            </p>
            <Button variant="ghost" onPress={() => navigate(CONNECTED_HOME)}>
              <FormattedMessage id="onboarding.skip" />
            </Button>
          </div>
        </div>
      </Layout.Content>
    </Layout.Root>
  )
}
