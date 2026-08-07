import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { AdminSeasonFormSheet } from './AdminSeasonFormSheet'

type Props = {
  open: boolean
  seasonId?: string
}

export class AdminSeasonFormSheetPage {
  onOpenChange = vi.fn()
  private props: Props

  constructor(props: Partial<Props> = {}) {
    this.props = { open: true, ...props }
  }

  render() {
    render(<AdminSeasonFormSheet {...this.props} onOpenChange={this.onOpenChange} />)
    return this
  }

  createTitle() {
    return screen.queryByText('adminSeasons.dialog.create.title')
  }

  editTitle() {
    return screen.queryByText('adminSeasons.dialog.edit.title')
  }

  form() {
    return screen.queryByTestId('season-form')
  }

  linearProgress() {
    return screen.queryByTestId('linear-progress')
  }

  notFound() {
    return screen.queryByTestId('not-found')
  }
}
