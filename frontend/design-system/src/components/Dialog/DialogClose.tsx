import * as React from 'react'
import { Button } from 'react-aria-components'

function DialogClose({ className, ...props }: React.ComponentProps<typeof Button>) {
  return <Button slot="close" data-slot="dialog-close" className={className} {...props} />
}

export { DialogClose }
