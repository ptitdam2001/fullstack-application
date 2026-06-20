import { ToggleThemeMode } from '@Theme/ToggleThemeMode'
import { type FC, type ReactNode } from 'react'
import { SidebarTrigger, Typography } from '@repo/design-system'
import { LanguageSwitcher } from '@I18n/'

type TopBarProps = {
  title?: ReactNode
  children?: ReactNode
  isAnonymous?: boolean
}

export const TopBar: FC<TopBarProps> = ({ title, children, isAnonymous }) => (
  <section className="flex shrink-0 items-center gap-2 transition-[width] ease-linear">
    {!isAnonymous && <SidebarTrigger />}

    <div className="grow">{children}</div>

    {title && <Typography.Title3 className="mx-2">{title}</Typography.Title3>}

    <div className="flex items-center gap-2 pr-4">
      <LanguageSwitcher />
      <ToggleThemeMode />
    </div>
  </section>
)
