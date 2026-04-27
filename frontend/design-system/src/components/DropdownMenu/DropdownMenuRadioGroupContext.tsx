import * as React from 'react'

export const DropdownMenuRadioGroupContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
} | null>(null)

export function useDropdownMenuRadioGroup() {
  return React.useContext(DropdownMenuRadioGroupContext)
}
