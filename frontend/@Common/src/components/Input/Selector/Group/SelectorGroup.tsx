import React, { ReactNode } from 'react'
import { StyledSelectorGroupChild, StyledSelectorGroupContainer, StyledSelectorGroupLabel } from '../styledComponent'

export type SelectorGroupProps = {
  label: ReactNode
  children: ReactNode
}

export const SelectorGroup: React.FC<SelectorGroupProps> = ({ label, children }) => (
  <li className="SelectorGroup">
    <StyledSelectorGroupContainer>
      <StyledSelectorGroupLabel>{label}</StyledSelectorGroupLabel>
      <StyledSelectorGroupChild>
        <ul>{children}</ul>
      </StyledSelectorGroupChild>
    </StyledSelectorGroupContainer>
  </li>
)
