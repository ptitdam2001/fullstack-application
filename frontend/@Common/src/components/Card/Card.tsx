import { PropsWithChildren } from 'react'
import { styled } from 'styled-components'
import tw, { css } from 'twin.macro'
import { WithDataTestIdProps } from 'types'

export type CardProps = PropsWithChildren<{
  direction?: 'column' | 'row' | 'column-reverse' | 'row-reverse'
}> &
  WithDataTestIdProps

export const Card = styled.section<CardProps>`
  ${tw`
    m-2
    p-2
    shadow-sm
    border
    border-gray-900/10
    bg-white
    flex
    rounded-lg
    border-solid
  `}
  ${({ direction = 'row' }) => css`
    flex-direction: ${direction};
  `}
`
