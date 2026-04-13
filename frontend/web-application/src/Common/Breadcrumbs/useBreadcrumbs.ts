import type React from 'react'
import { useMatches } from 'react-router'

export type BreadcrumbHandle = {
  breadcrumb: React.ReactNode | ((params: Record<string, string | undefined>) => React.ReactNode)
}

export type BreadcrumbEntry = {
  node: React.ReactNode
  to: string
  isLast: boolean
}

function isBreadcrumbHandle(handle: unknown): handle is BreadcrumbHandle {
  return !!handle && typeof handle === 'object' && 'breadcrumb' in handle
}

export const useBreadcrumbs = (): BreadcrumbEntry[] => {
  const matches = useMatches()

  const entries = matches
    .filter(match => isBreadcrumbHandle(match.handle))
    .map(match => {
      const handle = match.handle as BreadcrumbHandle
      const node =
        typeof handle.breadcrumb === 'function'
          ? handle.breadcrumb(match.params as Record<string, string | undefined>)
          : handle.breadcrumb
      return { node, to: match.pathname }
    })

  return entries.map((entry, index) => ({
    ...entry,
    isLast: index === entries.length - 1,
  }))
}
