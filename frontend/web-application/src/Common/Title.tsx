import { className as cn } from '@Common/utils/className'

type TitleProps = {
  children: React.ReactNode
  className?: string
}

export const Title: React.FC<TitleProps> = ({ children, className }) => (
  <h1 className={cn(`text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50`, className)}>{children}</h1>
)
