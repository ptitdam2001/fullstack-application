import { PropsWithChildren, ReactNode } from 'react'

type TextWithIconProps = PropsWithChildren<{
  icon: ReactNode
}>

export const TextWithIcon = ({ icon, children }: TextWithIconProps) => (
  <span className="flex flex-row gap-2 items-center">
    {icon}
    <span className="flex-grow flex flex-col">{children}</span>
  </span>
)
