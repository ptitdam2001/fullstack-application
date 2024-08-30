import { IconButton } from '@Components/Buttons'
import { Close } from '@Components/Icon'
import { ReactNode } from 'react'
import { useDrawerToggleOpen } from '../hooks/useDrawerToggleOpen'

type DrawerHeaderProps = {
  title: ReactNode
  closeIcon?: ReactNode
  testId?: string
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({ title, testId, closeIcon = <Close /> }) => {
  const handleClick = useDrawerToggleOpen()

  return (
    <h2 className="text-lg font-semibold flex flex-row px-3 py-1 shadow-md h-9">
      <div className="flex-grow">{title}</div>
      <IconButton
        withBorder={false}
        onClick={handleClick}
        size="small"
        icon={closeIcon}
        testId={testId && `${testId}--close`}
      />
    </h2>
  )
}
