import { Outlet } from 'react-router'
import { TopBar } from './TopBar'
import { Main } from './components/Main'
import { cn } from '@repo/design-system'
import { useTheme } from '@Theme/Provider/ThemeProvider'

export const AnonymousLayout = () => {
  const currentTheme = useTheme()
  return (
    <section
      className={cn('flex h-full w-full flex-col', { dark: currentTheme && ['dark', 'system'].includes(currentTheme) })}
    >
      <TopBar title={'Anonymous'} isAnonymous />

      <Main className="grow p-1">
        <Outlet />
      </Main>
    </section>
  )
}
