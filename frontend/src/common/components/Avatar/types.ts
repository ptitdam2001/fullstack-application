import { WithDataTestIdProps } from '@Common/types'
import { ReactElement } from 'react'

export type AvatarProps = {
  size?: number | string
  shape?: 'square' | 'circle'
  imgSrc?: string
  text?: string
  icon?: ReactElement
  onClick?: VoidFunction
} & WithDataTestIdProps

export type AvatarImgProps = {
  readonly size: string
  readonly shape?: 'square' | 'circle'
} & WithDataTestIdProps
