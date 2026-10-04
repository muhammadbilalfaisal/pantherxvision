import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { handler } from '../functions/reviews.mjs'

describe('reviews Netlify function', () => {
  beforeEach(() => {
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'server-only-service-role-key-value')
    vi.stubEnv('REVIEW_RATE_LIMIT_SALT', 'test-rate-limit-salt')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('queries approved reviews using public fields only', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ review_count: 0, average_rating: 0 }] })
    vi.stubGlobal('fetch', fetchMock)

    const response = await handler({ httpMethod: 'GET', queryStringParameters: {}, headers: {} })
    expect(response.statusCode).toBe(200)
    expect(fetchMock.mock.calls[0][0]).toContain('status=eq.approved')
    expect(fetchMock.mock.calls[0][0]).not.toContain('email')
  })

  it('forces public submissions to pending and unverified', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    const response = await handler({
      httpMethod: 'POST',
      headers: { 'x-nf-client-connection-ip': '203.0.113.10' },
      body: JSON.stringify({
        rating: 5,
        name: 'Client Name',
        review: 'This is a legitimate review with enough detail to pass server-side validation.',
        email: 'private@example.com',
        status: 'approved',
        is_verified: true,
        avatar_url: 'https://malicious.example/avatar.png',
        startedAt: Date.now() - 5000,
      }),
    })

    expect(response.statusCode).toBe(202)
    const insertedReview = JSON.parse(fetchMock.mock.calls[2][1].body)
    expect(insertedReview.status).toBe('pending')
    expect(insertedReview.is_verified).toBe(false)
    expect(insertedReview.avatar_url).toBeNull()
  })
})
