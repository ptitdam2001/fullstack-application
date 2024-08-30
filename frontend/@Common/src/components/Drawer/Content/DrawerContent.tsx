import { ReactNode } from 'react'
import { useDrawerToggleOpen } from '../hooks/useDrawerToggleOpen'
import { DrawerOpenProvider } from '../Provider/DrawerOpenProvider'
import { DrawerConfigProvider } from '../Provider/DrawerConfigProvider'
import classNames from 'classnames'
import { WithDataTestIdProps, WithDesignProps } from 'types'

type DrawerContentProps = {
  children: (toggleFn: VoidFunction) => ReactNode
} & WithDataTestIdProps &
  WithDesignProps

export const DrawerContent: React.FC<DrawerContentProps> = ({ children, testId, className }) => {
  const isOpen = DrawerOpenProvider.useDrawerOpen()
  const { position, width } = DrawerConfigProvider.useDrawerConfig()

  const toggleFn = useDrawerToggleOpen()

  const expandedWidthClass = width ?? 'w-64' // `w-[${width}]` : 'w-64'

  return (
    <section
      data-testid={testId && `${testId}--content`}
      className={classNames('fixed top-0 h-full duration-500 bg-white shadow-lg flex flex-col', {
        [expandedWidthClass]: isOpen,
        'w-0': position === 'right' && !isOpen,
        'translate-x-0': isOpen,
        'left-0 z-20 transform -translate-x-full transition-all': position === 'left',
        'right-0 z-20': position === 'right',
      })}
    >
      <div className={classNames('box-content overflow-auto hover:overflow-scroll overscroll-contain', className)}>
        {children(toggleFn)}
      </div>
    </section>
  )
}
