import styled from 'styled-components'
import tw from 'twin.macro'

export const Title1 = styled.h1`
  ${tw`text-title font-black font-sans text-2xl md:text-xl uppercase`}
`

export const Title2 = styled.h2`
  ${tw`text-title font-bold font-sans text-xl md:text-lg`}
`

export const Title3 = styled.h3`
  ${tw`text-title font-medium font-sans text-lg md:text-base`}
`

export const SubTitle = styled.sub`
  ${tw`text-gray-300 font-light font-thin text-sm`}
`

export const Paragraph = styled.p`
  ${tw`leading-relaxed text-black font-normal text-base`}
`
