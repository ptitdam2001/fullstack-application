import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/design-system'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import type { UserWithoutPasswordRolesItem } from '@Sdk/model'
import { CoachTab } from './CoachTab/CoachTab'
import { PlayerTab } from './PlayerTab/PlayerTab'
import { RefereeTab } from './RefereeTab/RefereeTab'

type DashboardTabsProps = {
  roles: UserWithoutPasswordRolesItem[]
}

const ROLE_TABS = [
  { role: 'COACH' as UserWithoutPasswordRolesItem, labelKey: 'dashboard.tab.coach', Component: CoachTab },
  { role: 'PLAYER' as UserWithoutPasswordRolesItem, labelKey: 'dashboard.tab.player', Component: PlayerTab },
  { role: 'REFEREE' as UserWithoutPasswordRolesItem, labelKey: 'dashboard.tab.referee', Component: RefereeTab },
]

export const DashboardTabs = ({ roles }: DashboardTabsProps) => {
  const activeTabs = ROLE_TABS.filter((t) => roles.includes(t.role))

  if (activeTabs.length === 0) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-muted-foreground">
          <FormattedMessage id="dashboard.noRole.message" />
        </p>
        <Link to="/app/team" className="text-primary hover:underline text-sm font-medium">
          <FormattedMessage id="dashboard.noRole.cta" />
        </Link>
      </section>
    )
  }

  return (
    <Tabs defaultValue={activeTabs[0].role} className="flex flex-1 flex-col gap-0 p-4 pt-0">
      <TabsList className="mb-4 w-fit">
        {activeTabs.map((t) => (
          <TabsTrigger key={t.role} value={t.role}>
            <FormattedMessage id={t.labelKey} />
          </TabsTrigger>
        ))}
      </TabsList>
      {activeTabs.map(({ role, Component }) => (
        <TabsContent key={role} value={role}>
          <Component />
        </TabsContent>
      ))}
    </Tabs>
  )
}
