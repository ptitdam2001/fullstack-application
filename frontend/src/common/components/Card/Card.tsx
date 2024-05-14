import { memo } from 'react'
import { styled } from 'styled-components'
import tw from 'twin.macro'
import { CardProps } from './types'

const Card = styled.section<CardProps>`
  flex-direction: ${props => props.direction ?? 'row'};
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
`

export default memo(Card)
