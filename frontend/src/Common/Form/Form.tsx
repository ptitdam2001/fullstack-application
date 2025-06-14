import { DevTool } from '@hookform/devtools'
import { DevtoolUIProps } from '@hookform/devtools/dist/devToolUI'

type FormProps = {
  children: React.ReactNode
  enableDevTools?: boolean
  devToolsProps?: DevtoolUIProps
} & React.HTMLProps<HTMLFormElement>

export const Form: React.FC<FormProps> = ({ enableDevTools, devToolsProps, children, ...props }) => (
  <form {...props}>
    {children}
    {enableDevTools && <DevTool {...devToolsProps} />}
  </form>
)
