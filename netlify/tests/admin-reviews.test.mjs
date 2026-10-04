import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { handler } from '../functions/admin-reviews.mjs'

const admin = { id: '11111111-1111-1111-1111-111111111111', email: 'admin@example.com' }
const review = {
  id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', name: 'Client', company: 'Company', job_title: 'Owner',
  email: 'client@example.com', avatar_url: null, rating: 5, review: 'A detailed and legitimate client review for moderation testing.',
  status: 'pending', is_verified: false, created_at: '2026-10-04T10:00:00.000Z', approved_at: null,
}
const event = (method = 'GET', overrides = {}) => ({ httpMethod: method, headers: { cookie: 'pxv_admin_session=valid-token' }, queryStringParameters: {}, ...overrides })
const response = (body, status = 200, headers = {}) => new globalThis.Response(JSON.stringify(body), { status, headers })

describe('admin reviews Netlify function', () => {
  beforeEach(() => {
    vi.stubEnv('SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'server-only-service-role-key')
    vi.stubEnv('ADMIN_EMAILS', 'admin@example.com')
  })

  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

  it('rejects unauthenticated moderation requests', async () => {
    vi.stubGlobal('fetch', vi.fn())
    const result = await handler(event('GET', { headers: {} }))
    expect(result.statusCode).toBe(401)
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('rejects unauthenticated review mutations', async () => {
    vi.stubGlobal('fetch', vi.fn())
    const result = await handler(event('PATCH', { headers: {}, body: JSON.stringify({ id: review.id, action: 'status', status: 'approved' }) }))
    expect(result.statusCode).toBe(401)
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('rejects authenticated users who are not administrators', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response({ id: '2', email: 'user@example.com' })))
    const result = await handler(event())
    expect(result.statusCode).toBe(403)
  })

  it('allows an admin to fetch filtered, paginated reviews and statistics', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(response(admin))
      .mockResolvedValueOnce(response([review], 200, { 'content-range': '0-0/1' }))
      .mockResolvedValueOnce(response([{ total_reviews: 1, pending_reviews: 1, approved_reviews: 0, rejected_reviews: 0, average_approved_rating: 0 }]))
    vi.stubGlobal('fetch', fetchMock)
    const result = await handler(event('GET', { queryStringParameters: { status: 'pending', rating: '5', search: 'Client', sort: 'highest', page: '1' } }))
    expect(result.statusCode).toBe(200)
    expect(JSON.parse(result.body)).toMatchObject({ total: 1, page: 1, stats: { pending: 1 } })
    expect(fetchMock.mock.calls[1][0]).toContain('status=eq.pending')
    expect(fetchMock.mock.calls[1][0]).toContain('rating=eq.5')
  })

  it.each([
    ['approved', 'approved'],
    ['rejected', 'rejected'],
    ['pending', 'pending'],
  ])('allows an admin to set a review status to %s', async (status, expected) => {
    const updated = { ...review, status: expected, approved_at: expected === 'approved' ? '2026-10-04T11:00:00.000Z' : null }
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response(admin))
      .mockResolvedValueOnce(response([review]))
      .mockResolvedValueOnce(response([updated]))
      .mockResolvedValueOnce(response({})))
    const result = await handler(event('PATCH', { body: JSON.stringify({ id: review.id, action: 'status', status }) }))
    expect(result.statusCode).toBe(200)
    expect(JSON.parse(result.body).review.status).toBe(expected)
  })

  it.each([true, false])('allows an admin to set verified to %s', async isVerified => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response(admin))
      .mockResolvedValueOnce(response([{ ...review, is_verified: !isVerified }]))
      .mockResolvedValueOnce(response([{ ...review, is_verified: isVerified }]))
      .mockResolvedValueOnce(response({})))
    const result = await handler(event('PATCH', { body: JSON.stringify({ id: review.id, action: 'verified', isVerified }) }))
    expect(result.statusCode).toBe(200)
    expect(JSON.parse(result.body).review.is_verified).toBe(isVerified)
  })

  it('allows an admin to delete a review', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response(admin))
      .mockResolvedValueOnce(response([review]))
      .mockResolvedValueOnce(response({}))
      .mockResolvedValueOnce(response({})))
    const result = await handler(event('DELETE', { body: JSON.stringify({ id: review.id }) }))
    expect(result.statusCode).toBe(200)
    expect(JSON.parse(result.body).deleted).toBe(true)
  })

  it('rejects invalid review identifiers without querying the review table', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(response(admin))
    vi.stubGlobal('fetch', fetchMock)
    const result = await handler(event('PATCH', { body: JSON.stringify({ id: 'invalid', action: 'status', status: 'approved' }) }))
    expect(result.statusCode).toBe(404)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('returns a safe error when Supabase fails', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(response(admin))
      .mockResolvedValueOnce(response({}, 500))
      .mockResolvedValueOnce(response([], 200)))
    const result = await handler(event())
    expect(result.statusCode).toBe(502)
    expect(JSON.parse(result.body).error).toMatch(/unable to load/i)
  })
})
