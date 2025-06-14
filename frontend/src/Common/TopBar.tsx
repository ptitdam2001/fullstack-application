import { ToggleThemeMode } from '@Theme/ToggleThemeMode'
import { FC, ReactNode } from 'react'
import { AuthActions } from '@Auth/AuthActions'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Title } from './Title'

type TopBarProps = {
  title: ReactNode
  children?: ReactNode
  isAnonymous?: boolean
}

export const TopBar: FC<TopBarProps> = ({ title, children, isAnonymous }) => (
  <header className="flex h-[5vh] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
    {!isAnonymous && <SidebarTrigger />}
    <Separator orientation="vertical" className="mr-2 h-4" />

    <div className="flex-grow-1">{children}</div>
    {title && <Title className="mx-2">{title}</Title>}
    <div className="flex pr-4 gap-2 items-center">
      <ToggleThemeMode />
      {!isAnonymous && <AuthActions />}
    </div>
  </header>
)
