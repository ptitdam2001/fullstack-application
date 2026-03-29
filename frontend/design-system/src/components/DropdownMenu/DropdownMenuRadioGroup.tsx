import * as React from 'react'

type DropdownMenuRadioGroupProps = {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

const DropdownMenuRadioGroupContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
} | null>(null)

function useDropdownMenuRadioGroup() {
  return React.useContext(DropdownMenuRadioGroupContext)
}

function DropdownMenuRadioGroup({ value, onValueChange, children }: DropdownMenuRadioGroupProps) {
  return (
    <DropdownMenuRadioGroupContext.Provider value={{ value, onValueChange }}>
      <div data-slot="dropdown-menu-radio-group" role="group">
        {children}
      </div>
    </DropdownMenuRadioGroupContext.Provider>
  )
}

export { DropdownMenuRadioGroup, useDropdownMenuRadioGroup }
