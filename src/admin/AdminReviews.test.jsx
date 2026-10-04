import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MotionConfig } from 'framer-motion'
import { MemoryRouter } from 'react-router-dom'
import AdminReviews from './AdminReviews'

const review = {
  id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', name: 'Ayesha Khan', company: 'Acme', job_title: 'Founder',
  email: 'ayesha@example.com', rating: 5, review: 'Panther X Vision delivered a thoughtful campaign with clear communication and measurable results.',
  status: 'pending', is_verified: false, created_at: '2026-10-04T10:00:00.000Z', approved_at: null,
}

const ok = data => ({ ok: true, status: 200, json: async () => data })

function renderPage() {
  return render(<MemoryRouter><MotionConfig reducedMotion="always"><AdminReviews /></MotionConfig></MemoryRouter>)
}

describe('admin review moderation UI', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('loads statistics, reviews, responsive cards, and the detail modal', async () => {
    vi.stubGlobal('fetch', vi.fn(async url => String(url).includes('action=session')
      ? ok({ user: { id: '1', email: 'admin@example.com' } })
      : ok({ reviews: [review], total: 1, page: 1, pageSize: 20, stats: { total: 1, pending: 1, approved: 0, rejected: 0, averageApproved: 0 } })))
    renderPage()
    expect(await screen.findByRole('heading', { name: 'Reviews' })).toBeInTheDocument()
    expect(await screen.findAllByText('Ayesha Khan')).toHaveLength(2)
    expect(screen.getByText(/1 results/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'View and moderate' }))
    const dialog = await screen.findByRole('dialog', { name: 'Ayesha Khan' })
    expect(within(dialog).getByText('ayesha@example.com')).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Mark as Verified' })).toBeInTheDocument()
  })

  it('sends filters and pagination to the server', async () => {
    const fetchMock = vi.fn(async url => String(url).includes('action=session')
      ? ok({ user: { id: '1', email: 'admin@example.com' } })
      : ok({ reviews: [review], total: 21, page: 1, pageSize: 20, stats: { total: 21, pending: 1, approved: 20, rejected: 0, averageApproved: 4.8 } }))
    vi.stubGlobal('fetch', fetchMock)
    renderPage()
    await screen.findAllByText('Ayesha Khan')
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'pending' } })
    await waitFor(() => expect(fetchMock.mock.calls.some(([url]) => String(url).includes('status=pending'))).toBe(true))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    await waitFor(() => expect(fetchMock.mock.calls.some(([url]) => String(url).includes('page=2'))).toBe(true))
  })

  it('shows the authentication state', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({ error: 'Authentication required.' }) }))
    renderPage()
    expect(await screen.findByRole('heading', { name: 'Admin sign in' })).toBeInTheDocument()
  })

  it('shows the honest empty state', async () => {
    vi.stubGlobal('fetch', vi.fn(async url => String(url).includes('action=session')
      ? ok({ user: { id: '1', email: 'admin@example.com' } })
      : ok({ reviews: [], total: 0, page: 1, pageSize: 20, stats: { total: 0, pending: 0, approved: 0, rejected: 0, averageApproved: 0 } })))
    renderPage()
    await waitFor(() => expect(screen.getByText('No reviews have been submitted yet.')).toBeInTheDocument())
  })
})
