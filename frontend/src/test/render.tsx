import { AppProviders } from './AppProviders'

import { RenderOptions, render } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'

type WrapperProps = {
  children: ReactNode
}

export default (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'> & { wrapper?: ({ children }: WrapperProps) => ReactElement }) => {
  const { wrapper: Wrapper, ...otherOptions } = options || {}

  const OverrideWrapper = ({ children }: WrapperProps) => <AppProviders>{Wrapper ? <Wrapper>{children}</Wrapper> : children}</AppProviders>

  return render(ui, { wrapper: OverrideWrapper, ...otherOptions })
}
