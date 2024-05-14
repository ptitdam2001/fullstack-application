import { styled } from 'styled-components'
import tw from 'twin.macro'

export const TableTitle = styled.h2`
  ${tw`flex flex-row justify-between w-full mb-1 sm:mb-0 text-2xl leading-tight`}
`

export const TableCellHeader = styled.th`
  ${tw`px-5 py-3 text-sm text-left font-bold text-gray-800 uppercase bg-white border-b border-gray-200`}
`

export const TableCell = styled.td`
  ${tw`px-5 py-5 text-sm bg-white border-b border-gray-200`}
`

export const TableContainer = styled.div`
  ${tw`container mx-auto px-2 py-2 overflow-x-auto sm:-mx-4 sm:px-4 inline-block min-w-full overflow-hidden`}
`
