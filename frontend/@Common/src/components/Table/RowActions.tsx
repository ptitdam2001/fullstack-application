import { IconButton, PrimaryButton } from '@Components/Buttons'
import { Tooltip } from '@Components/Tooltip/Tooltip'
import { TableRowAction } from './types'

type Props<T> = {
  rowActions: TableRowAction<T>[]
  row: T
}

export const RowActions = <T,>({ rowActions, row }: Props<T>) => {
  if (rowActions.length === 0) {
    return null
  }

  return rowActions.map(({ onClick, disable, icon, label }) => {
    const handleClick = () => onClick(row)

    let isDisabled = false
    if (typeof disable === 'function') {
      isDisabled = disable(row)
    } else if (typeof disable === 'boolean') {
      isDisabled = disable
    }

    if (icon) {
      if (label && !isDisabled) {
        return (
          <Tooltip title={label} position="top">
            <IconButton onClick={handleClick} icon={icon} size="small" disabled={isDisabled} />
          </Tooltip>
        )
      }
      return <IconButton onClick={handleClick} icon={icon} size="small" disabled={isDisabled} />
    } else if (label) {
      return (
        <PrimaryButton onClick={handleClick} disabled={isDisabled}>
          {label}
        </PrimaryButton>
      )
    }
  })
}
