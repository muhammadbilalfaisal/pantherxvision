import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Contact from './Contact'

describe('contact form', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('associates visible labels with form controls', () => {
    render(<Contact />)
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('name', 'name')
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText(/tell us about your goals/i)).toHaveAttribute('name', 'message')
  })

  it('shows Formspree validation errors without making a real request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ errors: [{ message: 'Submission could not be validated.' }] }),
    }))
    render(<Contact />)
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/tell us about your goals/i), { target: { value: 'Grow the business' } })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/submission could not be validated/i)
    expect(fetch).toHaveBeenCalledOnce()
  })
})
