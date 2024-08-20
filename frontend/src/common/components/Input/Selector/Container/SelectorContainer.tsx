import { PropsWithChildren } from 'react'
import { SelectorConfigProvider, SelectorConfigType } from '../Provider/SelectorConfigProvider'
import { SelectorOptionsProvider } from '../Provider/SelectorOptionsProvider'
import { StyledSelectorContainer } from '../styledComponent'

export type SelectorContainerProps = PropsWithChildren<SelectorConfigType>

export const SelectorContainer = ({ children, ...config }: SelectorContainerProps) => {
  return (
    <SelectorConfigProvider value={config}>
      <SelectorOptionsProvider>
        <section>
          <StyledSelectorContainer role="list">{children}</StyledSelectorContainer>
        </section>
      </SelectorOptionsProvider>
    </SelectorConfigProvider>
  )
}
