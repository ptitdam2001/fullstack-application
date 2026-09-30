import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/design-system'
import React from 'react'
import { FormattedMessage } from 'react-intl'

import { useBreadcrumbs } from './useBreadcrumbs'

export const Breadcrumbs = () => {
  const entries = useBreadcrumbs()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/app">
            <FormattedMessage id="breadcrumb.home" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {entries.map(({ node, to, isLast }) => (
          <React.Fragment key={to}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isLast ? <BreadcrumbPage>{node}</BreadcrumbPage> : <BreadcrumbLink href={to}>{node}</BreadcrumbLink>}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
