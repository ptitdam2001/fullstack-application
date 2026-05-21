import type { UserRole } from '@Sdk/model/userRole'

type DashboardTabsProps = {
  roles: UserRole[]
}

export const DashboardTabs = ({ roles: _roles }: DashboardTabsProps) => (
  <section className="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
  </section>
)
