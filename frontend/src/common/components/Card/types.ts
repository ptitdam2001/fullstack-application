import { WithDateTestIdProps } from '@Common/types'
import { PropsWithChildren } from 'react'

export type CardProps = PropsWithChildren<{
  direction?: 'column' | 'row' | 'column-reverse' | 'row-reverse'
}> &
  WithDateTestIdProps
