type UseTestIdResult<T extends string> = Record<T, string | undefined>

export const useTestId = <T extends string>(prefix: string | undefined, elements: T[]): UseTestIdResult<T> => {
  return elements.reduce<UseTestIdResult<T>>(
    (acc, element) => ({
      ...acc,
      [element]: prefix ? `${prefix}.${element}` : undefined,
    }),
    {} as UseTestIdResult<T>
  )
}
