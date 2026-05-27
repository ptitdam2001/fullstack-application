import { ToggleThemeMode } from '@Theme/ToggleThemeMode'
import { type FC, type ReactNode } from 'react'
import { SidebarTrigger } from '@repo/design-system'
import { Title } from '@Common/Title'
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

    {title && <Title className="mx-2">{title}</Title>}

    <div className="flex items-center gap-2 pr-4">
      <LanguageSwitcher />
      <ToggleThemeMode />
    </div>
  </section>
)
