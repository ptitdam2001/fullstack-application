import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Sidebar } from './Sidebar'
import { SidebarProvider } from './SidebarProvider'
import { SidebarTrigger } from './SidebarTrigger'

const renderMobileSidebar = () =>
  render(
    <SidebarProvider>
      <Sidebar>
        <a href="/teams">Teams</a>
      </Sidebar>
      <SidebarTrigger />
    </SidebarProvider>
  )

describe('Sidebar on mobile', () => {
  beforeEach(() => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      query =>
        ({
          matches: true,
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders no sheet until the trigger is pressed', () => {
    renderMobileSidebar()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the sheet when the trigger is pressed', () => {
    renderMobileSidebar()
    fireEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }))
    expect(screen.getByRole('dialog')).toHaveAttribute('data-mobile', 'true')
    expect(screen.getByRole('link', { name: 'Teams' })).toBeInTheDocument()
  })

  it('renders no PressResponder warning: the sheet has no trigger inside it', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    renderMobileSidebar()
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('PressResponder'))
  })
})
