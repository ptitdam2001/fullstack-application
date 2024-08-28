import SelectorGroupProvider from '../Provider/SelectorGroupProvider'

export const useGroup = () => {
  const groupDispatch = SelectorGroupProvider.useSelectorGroupDispatch()
  const childrenIds = SelectorGroupProvider.useSelectorGroup()

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
