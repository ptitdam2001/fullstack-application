import { FloatingFocusManager } from '@floating-ui/react'
import { usePopoverContext } from '../Provider/PopoverProvider'
import { ReactNode, useId } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { WithDataTestIdProps, WithDesignProps } from 'types'

const ContentContainer = styled.div`
  ${tw`
  bg-white
  rounded-md
  shadow-lg
  dark:bg-gray-800
  ring-1
  ring-black
  ring-opacity-5
  p-1
  w-max
  h-max`}
`

type PopoverContentProps = {
  children: (closeFn: VoidFunction) => ReactNode
} & WithDataTestIdProps &
  WithDesignProps

export const PopoverContent = ({ children, className, testId }: PopoverContentProps) => {
  const { context, refs, floatingStyles, isOpen, getFloatingProps, setOpen } = usePopoverContext()

  const headingId = useId()

  return isOpen ? (
    <FloatingFocusManager context={context} modal={false}>
      <ContentContainer
        className={className}
        ref={refs.setFloating}
        style={floatingStyles}
        aria-labelledby={headingId}
        {...getFloatingProps()}
        data-testid={testId}
      >
        {children(() => {
          setOpen(!isOpen)
        })}
      </ContentContainer>
    </FloatingFocusManager>
  ) : null
}
