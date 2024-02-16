import { render } from '@testing-library/react'
import { RequestHandler } from 'msw'

import { server } from '../../config/mocks/node'
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from 'msw/lib/core/handlers/RequestHandler'
import { UrqlClientProvider } from './AppProviders'



type Props = {
  children: React.ReactNode
}

export const withGraphQLRenderer =
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  (children: React.ReactNode, options?: any) => (responseOverride?: RequestHandler<RequestHandlerDefaultInfo, any, any, RequestHandlerOptions>) => {
    if (responseOverride) {
      server.use(responseOverride)
    }
    render(<UrqlClientProvider>{children}</UrqlClientProvider>, options)
  }
