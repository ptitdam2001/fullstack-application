import { useId } from 'react'
import { IconButton, PrimaryButton } from '@Common/components/Buttons'
import { Tooltip } from '@Common/components/Tooltip'
import { TableRowAction } from './types'

type Props<T> = {
  rowActions: TableRowAction<T>[]
  row: T
}

export const RowActions = <T,>({ rowActions, row }: Props<T>) => {
  const id = useId()
  if (rowActions.length === 0) {
    return null
  }

  return rowActions.map(({ onClick, disable, icon, label }, index) => {
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
          <Tooltip title={label} position="top" key={`rowAction-${id}-${index}`}>
            <IconButton onClick={handleClick} icon={icon} size="small" disabled={isDisabled} />
          </Tooltip>
        )
      }
      return (
        <IconButton
          onClick={handleClick}
          icon={icon}
          size="small"
          disabled={isDisabled}
          key={`rowAction-${id}-${index}`}
        />
      )
    } else if (label) {
      return (
        <PrimaryButton onClick={handleClick} disabled={isDisabled} key={`rowAction-${id}-${index}`}>
          {label}
        </PrimaryButton>
      )
    }
  })
}
