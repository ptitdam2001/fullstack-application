import * as React from 'react'
import { Button } from 'react-aria-components'

function SheetClose({ className, ...props }: React.ComponentProps<typeof Button>) {
  return <Button slot="close" data-slot="sheet-close" className={className} {...props} />
}

export { SheetClose }
