import * as React from 'react'
import { Dialog as AriaDialog, Modal, ModalOverlay, Button } from 'react-aria-components'
import { XIcon } from 'lucide-react'

import { cn } from '../../utils/cn'

type SheetSide = 'top' | 'right' | 'bottom' | 'left'

const sideClasses: Record<SheetSide, string> = {
  right:
    'entering:slide-in-from-right exiting:slide-out-to-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
  left:
    'entering:slide-in-from-left exiting:slide-out-to-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
  top: 'entering:slide-in-from-top exiting:slide-out-to-top inset-x-0 top-0 h-auto border-b',
  bottom:
    'entering:slide-in-from-bottom exiting:slide-out-to-bottom inset-x-0 bottom-0 h-auto border-t',
}

type SheetContentProps = React.ComponentProps<typeof AriaDialog> & {
  side?: SheetSide
}

function SheetContent({ className, children, side = 'right', ...props }: SheetContentProps) {
  return (
    <ModalOverlay
      data-slot="sheet-portal"
      className="entering:animate-in entering:fade-in-0 exiting:animate-out exiting:fade-out-0 fixed inset-0 z-50 bg-black/50"
    >
      <Modal
        className={cn(
          'bg-background entering:animate-in exiting:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out entering:duration-500 exiting:duration-300',
          sideClasses[side],
          className
        )}
      >
        <AriaDialog data-slot="sheet-content" className="outline-none flex flex-col gap-4 h-full" {...props}>
          {(renderProps) => (
            <>
              {typeof children === 'function' ? children(renderProps) : children}
              <Button
                slot="close"
                className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
              >
                <XIcon className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  )
}

export { SheetContent }
