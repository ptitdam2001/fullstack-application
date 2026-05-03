import * as React from 'react'
import { ListBoxSection, Header } from 'react-aria-components'
import type { ListBoxSectionProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

type ComboboxSectionProps = Omit<ListBoxSectionProps<object>, 'children'> & {
  header?: string
  children?: React.ReactNode
}

export const ComboboxSection = ({ className, header, children, ...props }: ComboboxSectionProps) => (
  <ListBoxSection
    data-slot="combobox-section"
    className={cn('py-1', className)}
    {...props}
  >
    {header && (
      <Header className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">{header}</Header>
    )}
    {children}
  </ListBoxSection>
)
