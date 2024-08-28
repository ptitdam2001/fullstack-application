import { PropsWithChildren, useCallback } from 'react'
import { OptionValueType } from '../types'
import { useOptions } from '../hooks/useOptions'
import { useSelectorOptions } from '../Provider/SelectorOptionsProvider'
import { BaseOption } from './BaseOption'

export type SelectorOptionProps = PropsWithChildren<{
  id: OptionValueType
  selected?: boolean
}>

export const SelectorOption = ({ children, id, selected = false }: SelectorOptionProps) => {
  const { changeOption } = useOptions()
  const options = useSelectorOptions()

  const currentOption = options[id]

  const handleClick = useCallback(() => {
    changeOption(id)
  }, [changeOption, id])

  const isSelected = currentOption ? currentOption.selected : selected

  return (
    <BaseOption id={id} selected={isSelected} onClick={handleClick}>
      {children}
    </BaseOption>
  )
}
