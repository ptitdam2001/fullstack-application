import { MutableRefObject, useEffect, useRef } from 'react'

export const useClickOutside = (
  elementRefs: MutableRefObject<HTMLElement | null>[],
  callback: (event: Event) => void
): void => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const handleClickOutside = (event: Event): void => {
      if (elementRefs.every(elementRef => !elementRef.current?.contains(event.target as Node))) {
        callbackRef.current?.(event)
      }
    }

    document.addEventListener('click', handleClickOutside, true)

    return () => document.removeEventListener('click', handleClickOutside, true)
  }, [elementRefs])
}
