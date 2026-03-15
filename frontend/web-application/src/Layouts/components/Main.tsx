import { OpenProvider } from '@Providers/OpenProvider'
import clsx from 'clsx'
import { FC, ReactNode } from 'react'

type MainProps = {
  menuWidth?: string
  children: ReactNode
  className?: string
}

export const Main: FC<MainProps> = ({ menuWidth, children, className }) => {
  const isMenuOpen = OpenProvider.useValue()
  return (
    <main
      className={clsx('transition duration-250 ease-in-out', isMenuOpen ? `ml-[-${menuWidth}]` : 'ml-0', className)}
    >
      {children}
    </main>
  )
}
