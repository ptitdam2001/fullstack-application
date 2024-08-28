import styled from 'styled-components'
import tw from 'twin.macro'

export const MenuContainer = styled.nav`
  ${tw`flex flex-col gap-1 transform transition-all duration-300 shadow-sm py-2 h-full bg-primary`}
`

export const MenuHeader = styled.div`
  ${tw`flex flex-row-reverse px-2 pb-1`}
`
export const MenuList = styled.ul`
  ${tw`text-primaryText`}
`

export const MenuListItem = styled.li`
  ${tw`h-10 p-2 flex flex-row gap-1 align-middle items-center bg-primary`}
`
