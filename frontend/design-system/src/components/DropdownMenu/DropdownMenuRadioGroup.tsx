import * as React from 'react'
import { DropdownMenuRadioGroupContext } from './DropdownMenuRadioGroupContext'

type DropdownMenuRadioGroupProps = {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
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

export { DropdownMenuRadioGroup }
