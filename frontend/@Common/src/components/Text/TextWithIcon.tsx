import { PropsWithChildren, ReactNode, memo } from 'react'

type TextWithIconProps = PropsWithChildren<{
  icon: ReactNode
}>

const TextWithIcon = ({ icon, children }: TextWithIconProps) => (
  <span className="flex flex-row gap-2 items-center">
    {icon}
    <span className="flex-grow flex flex-col">{children}</span>
  </span>
)

export default memo(TextWithIcon)
