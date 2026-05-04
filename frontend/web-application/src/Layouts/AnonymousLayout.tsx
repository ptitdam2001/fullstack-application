import { Outlet } from 'react-router'
import { TopBar } from './TopBar'
import { cn, Layout } from '@repo/design-system'
import { useTheme } from '@Theme/Provider/ThemeProvider'

export const AnonymousLayout = () => {
  const currentTheme = useTheme()
  return (
    <Layout.Root className={cn({ dark: currentTheme && ['dark', 'system'].includes(currentTheme) })}>
      <Layout.Header>
        <TopBar title={'Anonymous'} isAnonymous />
      </Layout.Header>
      <Layout.Content className="p-1">
        <Outlet />
      </Layout.Content>
    </Layout.Root>
  )
}
