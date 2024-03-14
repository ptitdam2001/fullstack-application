import { ReactNode } from 'react'
import { styled } from 'styled-components'
import tw from 'twin.macro'

export interface CardProps {
  children: ReactNode
  direction?: 'column' | 'row' | 'column-reverse' | 'row-reverse'
}

export const Card = styled.div<CardProps>`
  flex-direction: ${(props) => props.direction ?? 'row'};
  ${tw`
    m-2
    p-2
    shadow-sm
    border
    border-gray-900/10
    flex
    flex
    rounded-lg
    border-solid
  `}
`
