import { useSelectorGroup, useSelectorGroupDispatch } from '../Provider/SelectorGroupProvider'

export const useGroup = () => {
  const groupDispatch = useSelectorGroupDispatch()
  const childrenIds = useSelectorGroup()

  return {
    addChildToGroup: (id: string) => {
      if (groupDispatch && !childrenIds?.includes(id)) {
        groupDispatch(prevChildIds => [...prevChildIds, id])
      }
    },
    removeChildOfGroup: (id: string) => {
      if (groupDispatch && childrenIds?.includes(id)) {
        groupDispatch(prevChildIds => {
          return prevChildIds.filter(elt => elt !== id)
        })
      }
    },
  }
}
