import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import React from 'react'

import { useLocation } from 'react-router'

export const Breadcrumbs = () => {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/app">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {pathnames
          .filter(path => path !== 'app')
          .map((value, index) => {
            const last = index === pathnames.length - 1
            const to = `/${pathnames.slice(0, index + 1).join('/')}`

            return last ? (
              <BreadcrumbItem key={to}>
                <BreadcrumbLink className="dark:text-gray-200 text-gray-400">{value}</BreadcrumbLink>
              </BreadcrumbItem>
            ) : (
              <React.Fragment key={to}>
                <BreadcrumbItem>
                  <BreadcrumbLink href={to}>{value}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </React.Fragment>
            )
          })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
