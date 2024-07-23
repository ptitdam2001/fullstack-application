import { WithDataTestIdProps } from '@Common/types'
import { PropsWithChildren } from 'react'

export type CardProps = PropsWithChildren<{
  direction?: 'column' | 'row' | 'column-reverse' | 'row-reverse'
}> &
  WithDataTestIdProps
