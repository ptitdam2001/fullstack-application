import React, { PropsWithChildren } from 'react'
import { styled } from 'styled-components'
import tw, { css } from 'twin.macro'
import { WithDataTestIdProps, WithDesignProps } from 'types'

export type CardProps = PropsWithChildren<{
  direction?: 'column' | 'row' | 'column-reverse' | 'row-reverse'
}> &
  WithDataTestIdProps &
  WithDesignProps

const StyledCard = styled.article<CardProps>`
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

export const Card: React.FC<CardProps> = ({ direction = 'row', children, testId, className }) => (
  <StyledCard direction={direction} className={className} data-testid={testId}>
    {children}
  </StyledCard>
)
