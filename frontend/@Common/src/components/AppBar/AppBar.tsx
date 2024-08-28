import { memo } from 'react'
import { Title1 } from '@Components/Typography'
import { classnameMerge } from '@Utils/classnames'

export interface AppBarProps {
  logo?: {
    img: React.ReactNode
    url?: string
  }
  title?: string
  rightContent?: React.ReactNode
  fixed?: boolean
}

export const AppBar = memo(({ logo, title, rightContent, fixed = false }: AppBarProps) => (
  <header
    className={classnameMerge(
      ['bg-primary', 'text-primaryText', 'dark:bg-primary-800', 'shadow-lg', 'w-full', 'z-10'],
      { fixed: fixed }
    )}
  >
    <div className="px-4 mx-auto max-w-7xl">
      <div className="flex items-center justify-between h-16">
        <div className="w-full justify-start flex items-center">
          <>
            {logo &&
              (logo.url ? (
                <a href={logo.url} className="flex-shrink-0 w-8 h-8 mr-2">
                  {logo.img}
                </a>
              ) : (
                <span className="mr-2">{logo.img}</span>
              ))}
            {title && <Title1 className="!text-primaryText">{title}</Title1>}
          </>
        </div>
        <div className="block">
          <div className="flex items-center ml-4 md:ml-6"></div>
        </div>
        <div className="flex -mr-2">{rightContent}</div>
      </div>
    </div>
  </header>
))
