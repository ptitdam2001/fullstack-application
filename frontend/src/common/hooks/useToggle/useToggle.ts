import { useCallback, useState } from 'react'

export const useToggle = (defaultValue: boolean) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultValue)

  const toggleOpen = useCallback(() => {
    setIsOpen(oldValue => !oldValue)
  }, [])

  return {
    isOpen,
    toggleOpen,
    setIsOpen,
  }
}
