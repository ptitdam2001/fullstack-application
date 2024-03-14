import classNames from 'classnames'
import { ReactElement, ReactNode, memo, useCallback, useState } from 'react'
import { IconButton } from '../Buttons'
import { Bars3, Close } from '../Icon'

export interface DrawerProps {
  open?: boolean
  toggleIcon?: ReactElement
  closeIcon?: ReactElement
  position?: 'left' | 'right'
  title?: string
  content: ReactNode
}

const Drawer = ({ open = false, toggleIcon = <Bars3 />, closeIcon = <Close />, position = 'left', title, content }: DrawerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(open)

  const toggleOpen = useCallback(() => {
    setIsOpen((oldValue) => !oldValue)
  }, [setIsOpen])

  return (
    <section className="flex" role='menu'>
      <IconButton onClick={toggleOpen} icon={toggleIcon} withBorder />
      <div
        className={classNames('fixed top-0 h-full duration-500 bg-white shadow-lg flex flex-col', {
          'w-64': isOpen,
          'w-0': position === 'right' && !isOpen,
          'translate-x-0': isOpen,
          'left-0 z-20 transform -translate-x-full transition-all': position === 'left',
          'right-0 z-20': position === 'right',
        })}
      >
        <h2 className="text-lg font-semibold flex flex-row px-3 py-1 shadow-md h-9">
          <span className="flex-grow">{title}</span>
          <IconButton withBorder={false} onClick={toggleOpen} size="small" icon={closeIcon} />
        </h2>
        <section className="px-2 py-2 box-content overflow-auto hover:overflow-scroll overscroll-contain">{content}</section>
      </div>
    </section>
  )
}
export default memo(Drawer)
