import { Outlet } from 'react-router'
import { TopBar } from '@Common/TopBar'
import { Main } from './components/Main'
import { className as cn } from '@Common/utils/className'
import { useTheme } from '@Theme/Provider/ThemeProvider'

export const AnonymousLayout = () => {
  const currentTheme = useTheme()
  return (
    <section
      className={cn('h-full w-full flex flex-col', { dark: currentTheme && ['dark', 'system'].includes(currentTheme) })}
    >
      <TopBar title={'Anonymous'} isAnonymous />

      <Main className="grow p-1">
        <Outlet />
      </Main>
    </section>
  )
}
