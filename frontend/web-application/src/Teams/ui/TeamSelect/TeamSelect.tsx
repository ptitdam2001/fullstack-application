import { type Team } from '../../domain/Team'

const SELECT_BASE_CLASS = [
  'border-input focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30',
  'flex w-full cursor-pointer rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs',
  'transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-invalid:border-destructive',
].join(' ')

type TeamSelectProps = Omit<React.ComponentProps<'select'>, 'children'> & {
  teams: Team[]
  placeholder?: string
}

export const TeamSelect = ({ teams, placeholder = '—', multiple, className, ...props }: TeamSelectProps) => (
  <select
    multiple={multiple}
    className={[SELECT_BASE_CLASS, multiple ? 'h-auto min-h-24' : 'h-9', className].filter(Boolean).join(' ')}
    {...props}
  >
    {!multiple && (
      <option value="" disabled>
        {placeholder}
      </option>
    )}
    {teams.map(team => (
      <option key={team.id} value={team.id}>
        {team.name}
      </option>
    ))}
  </select>
)
