import { Outlet } from 'react-router-dom'

export const AnonymousLayout = () => {
  return (
    <>
      <div>Anonymous</div>
      <Outlet />
    </>
  )
}
