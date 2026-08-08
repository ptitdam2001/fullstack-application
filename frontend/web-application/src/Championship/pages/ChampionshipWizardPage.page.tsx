import { render, screen, fireEvent } from '@testing-library/react'
import { ChampionshipWizardPage } from './ChampionshipWizardPage'

export class ChampionshipWizardPagePage {
  render() {
    render(<ChampionshipWizardPage />)
    return this
  }

  heading(name: string) {
    return screen.getByRole('heading', { name })
  }

  nextButton() {
    return screen.getByText('championshipWizard.action.next').closest('button') as HTMLButtonElement
  }

  previousButton() {
    return screen.getByText('championshipWizard.action.previous').closest('button') as HTMLButtonElement
  }

  clickNext() {
    fireEvent.click(this.nextButton())
    return this
  }

  clickPrevious() {
    fireEvent.click(this.previousButton())
    return this
  }

  selectSeason(name: RegExp | string) {
    fireEvent.click(screen.getByRole('radio', { name }))
    return this
  }

  selectCategory(name: RegExp | string) {
    fireEvent.click(screen.getByRole('button', { name }))
    return this
  }

  typeName(value: string) {
    fireEvent.change(screen.getByRole('textbox'), { target: { value } })
    return this
  }

  errorMessage() {
    return screen.queryByText('championshipWizard.error.createFailed')
  }
}
