import { Select, SelectItem } from '@repo/design-system'
import { type Team } from '../../domain/Team'

type TeamSelectProps = {
  teams: Team[]
  label?: string
  placeholder?: string
  value?: string
  onChange?: (key: string) => void
  isDisabled?: boolean
  className?: string
  'aria-label'?: string
}

export const TeamSelect = ({
  teams,
  label,
  placeholder = '—',
  value,
  onChange,
  isDisabled,
  className,
  'aria-label': ariaLabel,
}: TeamSelectProps) => (
  <Select
    label={label}
    placeholder={placeholder}
    value={value}
    onChange={key => onChange?.(key as string)}
    isDisabled={isDisabled}
    className={className}
    aria-label={ariaLabel ?? (label ? undefined : 'Équipe')}
  >
    {teams.map(team => (
      <SelectItem key={team.id} id={team.id}>
        {team.name}
      </SelectItem>
    ))}
  </Select>
)
