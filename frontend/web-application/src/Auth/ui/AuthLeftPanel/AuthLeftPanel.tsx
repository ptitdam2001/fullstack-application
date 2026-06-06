import { useIntl } from 'react-intl'

type AuthLeftPanelProps = {
  headline?: string
  subtext?: string
}

export const AuthLeftPanel = ({ headline, subtext }: AuthLeftPanelProps) => {
  const intl = useIntl()
  return (
    <div className="hidden h-full flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-700 p-10 text-white md:flex">
      <div className="text-2xl font-bold tracking-tight">HB</div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{headline ?? 'Handball'}</h1>
        <p className="text-slate-300">{subtext ?? intl.formatMessage({ id: 'auth.signin' })}</p>
      </div>
      <p className="text-xs text-slate-400">Handball Manager</p>
    </div>
  )
}
