import { Avatar, Form, FormField, TextInput } from '@Common/components'
import { useCurrentUser } from '@Authentication/hooks'

type FormData = {
  userName: string
  firstName: string
}

export const MyProfileForm = () => {
  const { user } = useCurrentUser()

  const onSubmit = (data: Partial<FormData>) => {
    console.log('>>>>>> submit', data)
  }

  console.log('----', user)
  return (
    <Form<FormData> name="profile" onSubmit={onSubmit} defaultValues={user}>
      <>
        <Avatar size={100} shape="square" imgSrc={user.avatar} />

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
      </>
    </Form>
  )
}
