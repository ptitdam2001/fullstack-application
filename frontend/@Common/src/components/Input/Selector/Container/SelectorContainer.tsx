import { PropsWithChildren } from 'react'
import SelectorConfigProvider, { SelectorConfigType } from '../Provider/SelectorConfigProvider'
import SelectorOptionsProvider from '../Provider/SelectorOptionsProvider'
import { StyledSelectorContainer } from '../styledComponent'

export type SelectorContainerProps = PropsWithChildren<SelectorConfigType>

export const SelectorContainer = ({ children, ...config }: SelectorContainerProps) => {
  return (
    <SelectorConfigProvider.Provider value={config}>
      <SelectorOptionsProvider.Provider>
        <section>
          <StyledSelectorContainer role="list">{children}</StyledSelectorContainer>
        </section>
      </SelectorOptionsProvider.Provider>
    </SelectorConfigProvider.Provider>
  )
}
