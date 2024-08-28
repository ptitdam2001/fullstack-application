import { BaseOptionProps } from '../Option/BaseOption'
import { SelectorOption } from '../Option/SelectorOption'
import { StyledSelectorGroupChild, StyledSelectorGroupContainer, StyledSelectorGroupLabel } from '../styledComponent'
import { SelectorGroupProps } from './SelectorGroup'

type SelectorOptionGroupProps = SelectorGroupProps & Pick<BaseOptionProps, 'id' | 'selected'>

export const SelectorOptionGroup = ({ children, id, label, selected }: SelectorOptionGroupProps) => {
  const isSelected = selected

  return (
    <li className="SelectorGroup">
      <StyledSelectorGroupContainer>
        <StyledSelectorGroupLabel>
          <SelectorOption id={id} selected={isSelected}>
            {label}
          </SelectorOption>
        </StyledSelectorGroupLabel>
        <StyledSelectorGroupChild>
          <ul>{children}</ul>
        </StyledSelectorGroupChild>
      </StyledSelectorGroupContainer>
    </li>
  )
}
