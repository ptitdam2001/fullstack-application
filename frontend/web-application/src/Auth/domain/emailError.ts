/**
 * i18n key of an email field that fails the zod schema: "required" when nothing was typed, "invalid email" otherwise.
 * The value is tested, not the zod issue code: the codes change between zod versions.
 */
export const getEmailErrorKey = (value: string | null | undefined, namespace: 'auth' | 'register'): string =>
  value?.trim() ? `${namespace}.error.invalidEmail` : `${namespace}.error.required`
