import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ReviewSection from './ReviewSection'

const approvedReview = {
  id: 'review-1',
  name: 'Client Name',
  company: 'Client Company',
  job_title: 'Founder',
  avatar_url: null,
  rating: 5,
  review: 'Panther X Vision delivered clear communication and excellent work throughout our entire engagement.',
  is_verified: true,
  approved_at: '2026-10-01T10:00:00Z',
}

describe('ReviewSection', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('shows the honest empty state when there are no approved reviews', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reviews: [], summary: { count: 0, average: 0 } }),
    }))
    render(<ReviewSection />)
    expect(await screen.findByText(/be among our first clients/i)).toBeInTheDocument()
    expect(screen.queryByText(/4\.9\/5/i)).not.toBeInTheDocument()
  })

  it('renders approved review data and its dynamic aggregate', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reviews: [approvedReview], summary: { count: 1, average: 5 } }),
    }))
    render(<ReviewSection />)
    expect(await screen.findByText('Client Name')).toBeInTheDocument()
    expect(screen.getByText('5.0/5')).toBeInTheDocument()
    expect(screen.getByText(/verified client/i)).toBeInTheDocument()
  })

  it('validates required review fields without sending a request', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reviews: [], summary: { count: 0, average: 0 } }),
    })
    vi.stubGlobal('fetch', fetchMock)
    render(<ReviewSection />)
    const trigger = await screen.findByRole('button', { name: /share your experience/i })
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('button', { name: /submit review/i }))
    expect(screen.getByText(/choose a rating/i)).toBeInTheDocument()
    expect(screen.getByText(/your name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/your review is required/i)).toBeInTheDocument()
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
  })
})
