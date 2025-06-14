/**
 * Type to permit optionnal one or more props of given type
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
