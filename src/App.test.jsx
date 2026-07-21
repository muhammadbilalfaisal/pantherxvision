import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('application routing', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('renders the home page', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /we don't just market/i })).toBeInTheDocument()
  })

  it('renders a useful not-found page for unknown routes', () => {
    window.history.pushState({}, '', '/missing-page')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /page not found/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /return home/i })).toHaveAttribute('href', '/')
  })
})
