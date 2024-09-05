import { usePopoverContext } from '@Components/Popover/Provider/PopoverProvider'
import { memo, ReactNode } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { DropDownProps } from './types'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const StyledDropdownButton = styled.div`
  ${tw`
    flex
    items-center
    gap-1
  `}
`
const RotatingChevron = styled(ChevronDownIcon)<{ $isOpen: boolean }>`
  ${tw`w-5 h-5`}
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s ease-in-out;
`

type DropdownButtonProps = Pick<DropDownProps, 'icon'> & {
  children: ReactNode
}

export const DropdownButton = memo<DropdownButtonProps>(({ children, icon }) => {
  const { isOpen } = usePopoverContext()
  return (
    <StyledDropdownButton>
      {children}
      {icon || <RotatingChevron $isOpen={isOpen} />}
    </StyledDropdownButton>
  )
})
