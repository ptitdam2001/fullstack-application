import { PropsWithChildren, useEffect } from 'react'
import { OptionValueType } from '../types'
import { useOptions } from '../hooks/useOptions'
import { useSelectorOptions } from '../Provider/SelectorOptionsProvider'
import { SelectorOptionContainer } from '../styledComponent'
import { CheckCircle, CheckCircleOutline } from '@Common/components/Icon'
import classNames from 'classnames'
import { useSelectorConfig } from '../Provider/SelectorConfigProvider'

export type BaseOptionProps = PropsWithChildren<{
  id: OptionValueType
  selected?: boolean
  onClick: VoidFunction
}>

export const BaseOption = ({ children, id, onClick, selected = false }: BaseOptionProps) => {
  const { setOption, removeOption } = useOptions()
  const options = useSelectorOptions()
  const { disabled } = useSelectorConfig()

  const currentOption = options[id]

  useEffect(() => {
    setOption(id, selected)

    return () => {
      removeOption(id)
    }
  }, [])

  const isSelected = currentOption ? currentOption.selected : selected

  return (
    <SelectorOptionContainer
      key={id}
      onClick={!disabled ? onClick : undefined}
      role="button"
      className={classNames({
        'bg-slate-100': isSelected,
        'hover:cursor-pointer': !disabled,
        'cursor-not-allowed opacity-25': disabled,
      })}
    >
      {isSelected ? <CheckCircle className="size-4 text-primary" /> : <CheckCircleOutline className="size-4" />}

      <div className="flex-1">{children}</div>
    </SelectorOptionContainer>
  )
}
