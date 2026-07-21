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
    expect(document.title).toBe('Panther X Vision | Digital Marketing Agency in Karachi')
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', 'https://pantherxvision.com')
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'index, follow')
  })

  it('renders a useful not-found page for unknown routes', () => {
    window.history.pushState({}, '', '/missing-page')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /page not found/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /return home/i })).toHaveAttribute('href', '/')
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
    expect(document.querySelector('link[rel="canonical"]')).not.toBeInTheDocument()
  })
})
