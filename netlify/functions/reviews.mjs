import { createHash } from 'node:crypto'

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
}
const PUBLIC_FIELDS = 'id,name,company,job_title,avatar_url,rating,review,is_verified,approved_at'

const respond = (statusCode, body, extraHeaders = {}) => ({
  statusCode,
  headers: { ...JSON_HEADERS, ...extraHeaders },
  body: JSON.stringify(body),
})

const cleanText = (value, maxLength) => typeof value === 'string'
  ? value.replace(/\p{Cc}/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength)
  : ''

function validateReview(payload) {
  const review = {
    rating: Number(payload.rating),
    name: cleanText(payload.name, 80),
    company: cleanText(payload.company, 120) || null,
    job_title: cleanText(payload.jobTitle, 120) || null,
    email: cleanText(payload.email, 254).toLowerCase() || null,
    review: cleanText(payload.review, 1200),
  }
  if (!Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5) return { error: 'Choose a rating from 1 to 5.' }
  if (!review.name || review.name.length > 80) return { error: 'Enter a valid name.' }
  if (review.review.length < 40 || review.review.length > 1200) return { error: 'Review must be between 40 and 1,200 characters.' }
  if (review.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(review.email)) return { error: 'Enter a valid email address.' }
  return { review }
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return { url, key }
}

async function supabaseFetch(config, path, options = {}) {
  return fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      ...options.headers,
    },
  })
}

function clientIp(event) {
  return event.headers['x-nf-client-connection-ip']
    || event.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || 'unknown'
}

export async function handler(event) {
  const config = supabaseConfig()
  if (!config) return respond(503, { error: 'Reviews are not configured yet.' })

  if (event.httpMethod === 'GET') {
    const limit = Math.min(12, Math.max(1, Number(event.queryStringParameters?.limit) || 6))
    const offset = Math.max(0, Number(event.queryStringParameters?.offset) || 0)
    const [reviewsResponse, summaryResponse] = await Promise.all([
      supabaseFetch(
        config,
        `reviews?select=${PUBLIC_FIELDS}&status=eq.approved&order=approved_at.desc&limit=${limit}&offset=${offset}`,
        { headers: { Accept: 'application/json' } },
      ),
      supabaseFetch(config, 'rpc/get_review_summary', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: '{}',
      }),
    ])
    if (!reviewsResponse.ok || !summaryResponse.ok) return respond(502, { error: 'Reviews are temporarily unavailable.' })
    const summaryRows = await summaryResponse.json()
    const summary = summaryRows[0] || { review_count: 0, average_rating: 0 }
    return respond(200, {
      reviews: await reviewsResponse.json(),
      summary: {
        count: Number(summary.review_count) || 0,
        average: Number(summary.average_rating) || 0,
      },
    }, { 'Cache-Control': 'public, max-age=60, s-maxage=300' })
  }

  if (event.httpMethod !== 'POST') return respond(405, { error: 'Method not allowed.' }, { Allow: 'GET, POST' })
  if ((event.body || '').length > 20_000) return respond(413, { error: 'Submission is too large.' })

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch {
    return respond(400, { error: 'Invalid request.' })
  }

  // Honeypot submissions receive a neutral success response and are discarded.
  if (cleanText(payload.website, 200)) return respond(202, { submitted: true })
  const elapsed = Date.now() - Number(payload.startedAt)
  if (!Number.isFinite(elapsed) || elapsed < 2500 || elapsed > 86_400_000) return respond(400, { error: 'Please reopen the form and try again.' })

  const validated = validateReview(payload)
  if (validated.error) return respond(422, { error: validated.error })

  const salt = process.env.REVIEW_RATE_LIMIT_SALT || config.key.slice(-32)
  const ipHash = createHash('sha256').update(`${salt}:${clientIp(event)}`).digest('hex')
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const rateResponse = await supabaseFetch(
    config,
    `review_submission_attempts?select=id&ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(since)}&limit=5`,
    { headers: { Accept: 'application/json' } },
  )
  if (!rateResponse.ok) return respond(502, { error: 'Unable to submit your review right now.' })
  const attempts = await rateResponse.json()
  if (attempts.length >= 5) return respond(429, { error: 'Too many submissions. Please wait an hour and try again.' }, { 'Retry-After': '3600' })

  await supabaseFetch(config, 'review_submission_attempts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ ip_hash: ipHash }),
  })

  const insertResponse = await supabaseFetch(config, 'reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({
      ...validated.review,
      status: 'pending',
      is_verified: false,
      avatar_url: null,
    }),
  })
  if (!insertResponse.ok) return respond(502, { error: 'Something went wrong while submitting your review. Please try again.' })
  return respond(202, { submitted: true })
}
