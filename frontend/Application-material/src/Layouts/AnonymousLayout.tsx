import { Outlet } from 'react-router'
import { TopBar } from '@Common/TopBar'
import { Main } from './components/Main'

export const AnonymousLayout = () => {
  return (
    <section className="h-full w-full flex flex-col">
      <TopBar title={'Anonymous'} />

      <Main className="grow p-1">
        <Outlet />
      </Main>
    </section>
  )
}
