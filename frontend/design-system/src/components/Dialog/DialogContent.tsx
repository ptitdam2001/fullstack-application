import * as React from 'react'
import { Dialog as AriaDialog, Modal, ModalOverlay, Button } from 'react-aria-components'
import { XIcon } from 'lucide-react'

import { cn } from '../../utils/cn'

type DialogContentProps = React.ComponentProps<typeof AriaDialog> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function DialogContent({ className, children, open, defaultOpen, onOpenChange, ...props }: DialogContentProps) {
  // Controlled without a <Dialog> wrapper: a DialogTrigger without a pressable child makes react-aria warn.
  const controlledProps =
    open !== undefined || defaultOpen !== undefined || onOpenChange !== undefined
      ? { isOpen: open, defaultOpen, onOpenChange }
      : {}

  return (
    <ModalOverlay
      data-slot="dialog-portal"
      {...controlledProps}
      className="entering:animate-in entering:fade-in-0 exiting:animate-out exiting:fade-out-0 fixed inset-0 z-50 flex items-center justify-center bg-black/80"
    >
      <Modal
        className={cn(
          'bg-background entering:animate-in entering:fade-in-0 entering:zoom-in-95 exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95 z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          className
        )}
      >
        <AriaDialog data-slot="dialog-content" className="outline-none" {...props}>
          {renderProps => (
            <>
              {typeof children === 'function' ? children(renderProps) : children}
              <Button
                slot="close"
                className="ring-offset-background focus:ring-ring data-[entering]:bg-accent data-[entering]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              >
                <XIcon />
                <span className="sr-only">Close</span>
              </Button>
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  )
}

export { DialogContent }
