import classNames from 'classnames'
import { memo, useCallback } from 'react'
import { IconButton } from '../Buttons'
import { Bars3, Close } from '../Icon'
import { DrawerProps } from './types'
import { useToggle } from '@Hooks/useToggle'

const Drawer = ({
  open = false,
  toggleIcon = <Bars3 />,
  closeIcon = <Close />,
  position = 'left',
  title,
  content,
  className,
  onOpenChange,
  'data-testid': testId,
}: DrawerProps) => {
  const { toggleOpen, isOpen } = useToggle(open)

  const handleClick = useCallback(() => {
    onOpenChange?.(!isOpen)
    toggleOpen()
  }, [onOpenChange, isOpen, toggleOpen])

  return (
    <menu className={classNames('flex', className)} role="menu">
      {!isOpen && (
        <IconButton onClick={handleClick} icon={toggleIcon} withBorder data-testid={testId && `${testId}--toggle`} />
      )}
      <div
        data-testid={testId}
        className={classNames('fixed top-0 h-full duration-500 bg-white shadow-lg flex flex-col', {
          'w-64': isOpen,
          'w-0': position === 'right' && !isOpen,
          'translate-x-0': isOpen,
          'left-0 z-20 transform -translate-x-full transition-all': position === 'left',
          'right-0 z-20': position === 'right',
        })}
      >
        <h2 className="text-lg font-semibold flex flex-row px-3 py-1 shadow-md h-9">
          <div className="flex-grow">{title}</div>
          <IconButton
            withBorder={false}
            onClick={handleClick}
            size="small"
            icon={closeIcon}
            data-testid={testId && `${testId}--close`}
          />
        </h2>
        <section
          className="px-2 py-2 box-content overflow-auto hover:overflow-scroll overscroll-contain"
          data-testid={testId && `${testId}--content`}
        >
          {content}
        </section>
      </div>
    </menu>
  )
}
export default memo(Drawer)
