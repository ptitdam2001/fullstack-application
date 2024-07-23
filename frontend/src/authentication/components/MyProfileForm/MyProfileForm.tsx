import { Avatar, Form, FormBlock, FormField, PrimaryButton, TextInput } from '@Common/components'
import { useCurrentUser } from '@Authentication/hooks'
import { User, graphqlRequestClient, useUserUpdateMutation } from '@Api'

export const MyProfileForm = () => {
  const { user, isLoading } = useCurrentUser()
  const { mutateAsync } = useUserUpdateMutation(graphqlRequestClient)

  const onSubmit = async (data: Partial<User>) => {
    try {
      if (user && !!user.id) {
        await mutateAsync({ id: user.id, input: data })
      }
    } catch (err) {
      console.error(err)
    }
  }

  return !isLoading && !!user ? (
    <Form<User> name="profile" onSubmit={onSubmit} defaultValues={user}>
      <>
        <Avatar size={100} shape="square" imgSrc={user?.avatar || ''} />

        <FormField name="userName">
          {({ field, fieldState: { error } }) => (
            <TextInput {...field} error={error?.message} required label="Username" />
          )}
        </FormField>

        <FormField name="firstName">
          {({ field, fieldState: { error } }) => (
            <TextInput {...field} error={error?.message} required label="First name" />
          )}
        </FormField>

        <FormBlock>
          {form => (
            <PrimaryButton type="submit" disabled={form.formState.disabled || !form.formState.isDirty}>
              Save
            </PrimaryButton>
          )}
        </FormBlock>
      </>
    </Form>
  ) : (
    <div>Loading</div>
  )
}
