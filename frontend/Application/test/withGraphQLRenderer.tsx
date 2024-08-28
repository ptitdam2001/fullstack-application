import { RenderOptions, render } from '@testing-library/react'
import { RequestHandler } from 'msw'

import { server } from '../../config/mocks/node'
import { RequestHandlerDefaultInfo, RequestHandlerOptions } from 'msw/lib/core/handlers/RequestHandler'
import { UrqlClientProvider } from './AppProviders'

export const withGraphQLRenderer =
  (children: React.ReactNode, options?: RenderOptions) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (responseOverride?: RequestHandler<RequestHandlerDefaultInfo, any, any, RequestHandlerOptions>) => {
    if (responseOverride) {
      server.use(responseOverride)
    }
    render(<UrqlClientProvider>{children}</UrqlClientProvider>, options)
  }
