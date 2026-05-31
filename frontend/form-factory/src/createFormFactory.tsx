import * as React from 'react'
import {
  useForm as useRHFForm,
  useFieldArray,
  Controller,
  type ControllerRenderProps,
  type ControllerFieldState,
  type FieldArrayPath,
  type FieldPath,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
  type UseFieldArrayReturn,
  type Resolver,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ZodType, type z } from 'zod'

// ─── Types ───────────────────────────────────────────────────────────────────

export type FieldRenderProps<
  TValues extends FieldValues,
  TName extends FieldPath<TValues>,
> = {
  field: ControllerRenderProps<TValues, TName>
  fieldState: ControllerFieldState
}

export type FieldComponent<TValues extends FieldValues> = <TName extends FieldPath<TValues>>(props: {
  name: TName
  children: (renderProps: FieldRenderProps<TValues, TName>) => React.ReactNode
}) => React.ReactElement

export type FieldArrayRenderProps<
  TValues extends FieldValues,
  TName extends FieldArrayPath<TValues>,
> = UseFieldArrayReturn<TValues, TName>

export type FieldArrayComponent<TValues extends FieldValues> = <TName extends FieldArrayPath<TValues>>(props: {
  name: TName
  children: (renderProps: FieldArrayRenderProps<TValues, TName>) => React.ReactNode
}) => React.ReactElement

export type FormFactoryReturn<TValues extends FieldValues> = {
  form: UseFormReturn<TValues>
  Field: FieldComponent<TValues>
  FieldArray: FieldArrayComponent<TValues>
}

export type FormFactory<TValues extends FieldValues> = {
  useForm(options?: Omit<UseFormProps<TValues>, 'resolver'>): FormFactoryReturn<TValues>
}

// ─── Implementation ───────────────────────────────────────────────────────────

// TSchema must have matching output and input types so zodResolver can infer FieldValues.
// Schemas with .transform() that change the shape are not supported — use separate form/output types.
export function createFormFactory<TSchema extends ZodType<FieldValues, FieldValues>>(config: {
  schema: TSchema
}): FormFactory<z.output<TSchema>> {
  type TValues = z.output<TSchema>

  function useForm(options?: Omit<UseFormProps<TValues>, 'resolver'>): FormFactoryReturn<TValues> {
    const rhfForm = useRHFForm<TValues>({
      ...options,
      resolver: zodResolver(config.schema) as Resolver<TValues>,
    })

    // Refs hold stable component references across re-renders.
    // rhfForm.control is stable in RHF v7 (internally a ref object).
    const stableRefs = React.useRef<{
      Field?: FieldComponent<TValues>
      FieldArray?: FieldArrayComponent<TValues>
    }>({})

    if (!stableRefs.current.Field) {
      const Field = function Field<TName extends FieldPath<TValues>>({
        name,
        children,
      }: {
        name: TName
        children: (renderProps: FieldRenderProps<TValues, TName>) => React.ReactNode
      }) {
        return (
          <Controller
            name={name}
            control={rhfForm.control}
            render={({ field, fieldState }) => <>{children({ field, fieldState })}</>}
          />
        )
      }
      Field.displayName = 'FormField'
      stableRefs.current.Field = Field as FieldComponent<TValues>
    }

    if (!stableRefs.current.FieldArray) {
      const FieldArray = function FieldArray<TName extends FieldArrayPath<TValues>>({
        name,
        children,
      }: {
        name: TName
        children: (renderProps: FieldArrayRenderProps<TValues, TName>) => React.ReactNode
      }) {
        const methods = useFieldArray<TValues, TName>({ control: rhfForm.control, name })
        return <>{children(methods)}</>
      }
      FieldArray.displayName = 'FormFieldArray'
      stableRefs.current.FieldArray = FieldArray as FieldArrayComponent<TValues>
    }

    return {
      form: rhfForm,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      Field: stableRefs.current.Field!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      FieldArray: stableRefs.current.FieldArray!,
    }
  }

  return { useForm }
}