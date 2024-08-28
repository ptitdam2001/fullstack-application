import styled from 'styled-components'
import tw from 'twin.macro'

export const SelectorOptionContainer = styled.li`
  ${tw`
    flex flex-row min-h-5 items-center
    gap-2
    px-2
  `}
`

export const StyledSelectorContainer = styled.ul`
  ${tw`
    container rounded border border-gray-300
    divide-y divide-gray-200
    `}
`

export const StyledSelectorGroupContainer = styled.ul`
  ${tw`
    divide-y divide-gray-200
    `}
`

export const StyledSelectorGroupLabel = styled.li`
  ${tw`bg-gray-400/60 pl-2`}
`
export const StyledSelectorGroupChild = styled.li`
  ${tw`pl-2`}
`
