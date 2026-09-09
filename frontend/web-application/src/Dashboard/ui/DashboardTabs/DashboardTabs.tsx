import { Tab, Tabs, TabList, TabPanels, TabPanel } from '@repo/design-system'
import { FormattedMessage, useIntl } from 'react-intl'
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
  const intl = useIntl()
  const activeTabs = ROLE_TABS.filter(t => roles.includes(t.role))

  if (activeTabs.length === 0) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-muted-foreground">
          <FormattedMessage id="dashboard.noRole.message" />
        </p>
        <Link to="/app/team" className="text-primary text-sm font-medium hover:underline">
          <FormattedMessage id="dashboard.noRole.cta" />
        </Link>
      </section>
    )
  }

  return (
    <Tabs defaultSelectedKey={activeTabs[0].role} className="flex flex-1 flex-col gap-0 p-4 pt-0">
      <TabList aria-label={intl.formatMessage({ id: 'dashboard.tabs.label' })} className="mb-4 w-fit">
        {activeTabs.map(t => (
          <Tab key={t.role} id={t.role}>
            <FormattedMessage id={t.labelKey} />
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {activeTabs.map(({ role, Component }) => (
          <TabPanel key={role} id={role}>
            <Component />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}
