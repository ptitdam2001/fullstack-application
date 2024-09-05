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
  w-56
  mt-2
  bg-white
  dark:bg-gray-800
  py-1
`,
  withDivider && 'divide-y divide-gray-100',
])
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
