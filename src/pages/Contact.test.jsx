import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Contact from './Contact'

describe('contact form', () => {
  it('associates visible labels with form controls', () => {
    render(<Contact />)
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('name', 'name')
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText(/tell us about your goals/i)).toHaveAttribute('name', 'message')
  })

  it('shows an error when the submission endpoint is not configured', async () => {
    render(<Contact />)
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/tell us about your goals/i), { target: { value: 'Grow the business' } })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i)
  })
})
