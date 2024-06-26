import { memo } from 'react'
import { BaseIconProps } from './types'

export const ChevronDown = memo(({ className }: BaseIconProps) => (
  <svg
    className={className}
    strokeWidth={1.5}
    fill="currentColor"
    viewBox="0 0 1792 1792"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1408 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z" />
  </svg>
))
