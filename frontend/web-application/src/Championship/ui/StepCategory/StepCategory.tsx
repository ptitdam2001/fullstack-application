import { FormattedMessage } from 'react-intl'
import { Typography, cn } from '@repo/design-system'
import type { AgeCategory } from '@AgeCategory/domain/AgeCategory'

type StepCategoryProps = {
  categories: AgeCategory[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export const StepCategory = ({ categories, selectedId, onSelect }: StepCategoryProps) => (
  <div>
    <Typography.Title2>
      <FormattedMessage id="championshipWizard.step.category" />
    </Typography.Title2>
    <Typography.Body className="text-muted-foreground mb-5">
      <FormattedMessage id="championshipWizard.step.category.hint" />
    </Typography.Body>

    {categories.length === 0 ? (
      <Typography.Body className="text-muted-foreground">
        <FormattedMessage id="championshipWizard.step.category.empty" />
      </Typography.Body>
    ) : (
      <div className="flex flex-wrap gap-2.5">
        {categories.map(category => {
          const selected = category.id === selectedId
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(category.id)}
              className={cn(
                'border-border flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium',
                'hover:bg-secondary',
                selected && 'bg-primary text-primary-foreground border-primary'
              )}
            >
              {category.label}
              <span className={cn('text-xs opacity-65', selected && 'opacity-80')}>
                <FormattedMessage id={`adminAgeCategories.genre.${category.genre}`} />
              </span>
            </button>
          )
        })}
      </div>
    )}
  </div>
)
