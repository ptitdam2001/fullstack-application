import { graphql, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

export const handlers = [
  // Handles a "Login" mutation
  graphql.mutation('LoginUser', (req) => {
    const { login } = req.variables.input

    sessionStorage.setItem('is-authenticated', login)
    return HttpResponse.json({
      data: {
        login: {
          sessionId: 'abc-123',
        },
      },
    })
  }),

  graphql.query('Logout', () => {
    sessionStorage.removeItem('is-authenticated')
    return HttpResponse.json({
      data: {
        logout: true,
      },
    })
  }),

  // Handles a "GetUserInfo" query
  graphql.query('GetMe', () => {
    // const authenticatedUser = sessionStorage.getItem('is-authenticated')
    // if (!authenticatedUser) {
    //   // When not authenticated, respond with an error
    //   return HttpResponse.json({
    //     errors: [
    //       {
    //         message: 'Not authenticated',
    //         errorType: 'AuthenticationError',
    //       },
    //     ],
    //   })
    // }
    // When authenticated, respond with a query payload
    return HttpResponse.json({
      data: {
        getMe: {
          user: {
            userName: faker.person.firstName(),
            firstName: faker.person.firstName(),
            avatar: faker.image.avatar(),
          },
        },
      },
    })
  }),

  graphql.mutation('ResetPasswordMutation', () => {
    return HttpResponse.json({
      data: {
        redirection: '/reset-paswword/auth_token_123',
        status: 'email_sent',
      },
    })
  }),
]
