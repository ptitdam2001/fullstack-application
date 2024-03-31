import { graphql, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

import auth from './auth'

export const handlers = [
  ...auth,

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
]
