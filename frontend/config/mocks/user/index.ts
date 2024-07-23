import { faker } from '@faker-js/faker'
import { HttpResponse, graphql } from 'msw'

export default [
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
          status: 'active',
          user: {
            userName: faker.person.firstName(),
            firstName: faker.person.firstName(),
            avatar: faker.image.avatar(),
            id: faker.string.uuid(),
          },
        },
      },
    })
  }),

  graphql.mutation('UserUpdate', () => {
    return HttpResponse.json({
      data: {
        user: {
          id: faker.string.uuid(),
          email: '',
          name: faker.person.lastName(),
          role: 'user',
          avatar: faker.image.avatar(),
          updatedAt: faker.date.anytime().getTime(),
          createdAt: faker.date.anytime().getTime(),
        },
      },
    })
  }),
]
