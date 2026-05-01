import { ToggleThemeMode } from '@Theme/ToggleThemeMode'
import { type FC, type ReactNode } from 'react'
import { AuthActions } from '@Auth/ui/AuthActions'
import { SidebarTrigger, Separator } from '@repo/design-system'
import { Title } from './Title'
import { LanguageSwitcher } from '@I18n/'

type TopBarProps = {
  title: ReactNode
  children?: ReactNode
  isAnonymous?: boolean
}

export const TopBar: FC<TopBarProps> = ({ title, children, isAnonymous }) => (
  <header className="flex h-[5vh] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
    {!isAnonymous && <SidebarTrigger />}
    <Separator orientation="vertical" className="mr-2 h-4" />

    <div className="grow">{children}</div>
    {title && <Title className="mx-2">{title}</Title>}
    <div className="flex items-center gap-2 pr-4">
      <LanguageSwitcher />
      <ToggleThemeMode />
      {!isAnonymous && <AuthActions />}
    </div>
  </header>
)
