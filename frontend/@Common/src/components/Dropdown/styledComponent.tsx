import { styled } from 'styled-components'
import tw from 'twin.macro'

type DropdownMenuProps = {
  withDivider?: boolean
}

export const DropdownContainer = styled.div`
  ${tw`
  relative
  inline-block
  text-left
  `}
`

export const DropdownMenu = styled.ul<DropdownMenuProps>(({ withDivider }) => [
  tw`
  absolute
  left-0
  w-56
  mt-2
  origin-top-right
  bg-white
  rounded-md
  shadow-lg
  dark:bg-gray-800
  ring-1
  ring-black
  ring-opacity-5
  py-1
`,
  withDivider && 'divide-y divide-gray-100',
])

export const DropdownButton = styled.div`
  ${tw`
    flex
    items-center
    gap-1
  `}
`
export const DropdownItem = styled.li`
  ${tw`
    w-full
    block
    p-2
    min-h-8
    text-sm
    text-gray-700
    hover:bg-gray-100
    hover:text-gray-900
    dark:text-gray-100
    dark:hover:text-white
    dark:hover:bg-gray-600
    cursor-pointer
  `}
`
