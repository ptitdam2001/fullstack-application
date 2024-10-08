import SelectorConfigProvider from '../Provider/SelectorConfigProvider'
import SelectorOptionsProvider from '../Provider/SelectorOptionsProvider'
import { OptionValueType } from '../types'

export const useOptions = () => {
  const dispatchOptions = SelectorOptionsProvider.useSelectorOptionsDispatch()
  const { onChange, disabled } = SelectorConfigProvider.useSelectorConfig()

  const setOption = (id: OptionValueType, selected: boolean) => {
    dispatchOptions(previousOptions => ({ ...previousOptions, [id]: { selected } }))
  }

  const removeOption = (id: OptionValueType) => {
    dispatchOptions(previousOptions => {
      const newOptions = { ...previousOptions }
      delete newOptions[id]
      return newOptions
    })
  }

  const changeOption = (id: OptionValueType) => {
    if (!disabled) {
      dispatchOptions(previousOptions => {
        const newOptions = { ...previousOptions, [id]: { selected: !previousOptions[id].selected } }
        const selectedIds = Object.entries(newOptions)
          .filter(([, { selected }]) => selected)
          .map(([key]) => key)

        onChange?.(selectedIds)
        return newOptions
      })
    }
  }

  return {
    setOption,
    removeOption,
    changeOption,
  }
}
