type AuthLeftPanelProps = {
  headline?: React.ReactNode
  subtext?: string
}

export const AuthLeftPanel = ({
  headline = (
    <>
      Track every match.
      <br />
      <strong className="font-semibold">Dominate the season.</strong>
    </>
  ),
  subtext = 'Live stats, team management and tournament tools built for handball clubs and coaches.',
}: AuthLeftPanelProps) => (
  <div
    className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden"
    style={{ background: 'oklch(0.145 0 0)' }}
  >
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse 60% 50% at 30% 70%, oklch(0.4 0.12 175 / 0.35) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 80% 20%, oklch(0.5 0.15 215 / 0.2) 0%, transparent 60%)',
      }}
    />

    <div className="relative z-10 flex items-center gap-2.5">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'oklch(0.985 0 0)' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.145 0 0)" strokeWidth="1.75">
          <rect x="3" y="3" width="18" height="18" rx="3" strokeDasharray="3 2" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="7"
            fill="oklch(0.145 0 0)"
            stroke="none"
            fontFamily="monospace"
            fontWeight="600"
          >
            HB
          </text>
        </svg>
      </div>
      <span className="text-lg font-semibold tracking-tight" style={{ color: 'oklch(0.985 0 0)' }}>
        Handball
      </span>
    </div>

    <div className="relative z-10">
      <h2
        className="text-3xl font-light leading-snug tracking-tight mb-4"
        style={{ color: 'oklch(0.985 0 0)' }}
      >
        {headline}
      </h2>
      <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.985 0 0 / 0.6)', maxWidth: '28ch' }}>
        {subtext}
      </p>
    </div>
  </div>
)
