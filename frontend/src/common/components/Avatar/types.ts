import { WithDateTestIdProps } from '@Common/types'
import { ReactElement } from 'react'

export type AvatarProps = {
  size?: number
  shape?: 'square' | 'circle'
  imgSrc?: string
  text?: string
  icon?: ReactElement
  onClick?: VoidFunction
} & WithDateTestIdProps

export type AvatarImgProps = {
  readonly size: number
  readonly shape?: 'square' | 'circle'
} & WithDateTestIdProps
