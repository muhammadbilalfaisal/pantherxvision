const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
}

const SESSION_COOKIE = 'pxv_admin_session'
const REVIEW_FIELDS = 'id,name,company,job_title,email,avatar_url,rating,review,status,is_verified,created_at,approved_at'
const VALID_STATUSES = new Set(['pending', 'approved', 'rejected'])

const respond = (statusCode, body, extraHeaders = {}) => ({
  statusCode,
  headers: { ...JSON_HEADERS, ...extraHeaders },
  body: JSON.stringify(body),
})

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const adminEmails = new Set(
    (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim().toLowerCase()).filter(Boolean),
  )
  return url && key && adminEmails.size ? { url, key, adminEmails } : null
}

function parseCookies(header = '') {
  return header.split(';').reduce((cookies, part) => {
    const separator = part.indexOf('=')
    if (separator < 1) return cookies
    try {
      cookies[decodeURIComponent(part.slice(0, separator).trim())] = decodeURIComponent(part.slice(separator + 1).trim())
    } catch {
      // Ignore malformed cookies rather than failing the request.
    }
    return cookies
  }, {})
}

function sessionCookie(token, maxAge, secure = true) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? '; Secure' : ''}`
}

async function restFetch(settings, path, options = {}) {
  return fetch(`${settings.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: settings.key,
      Authorization: `Bearer ${settings.key}`,
      ...options.headers,
    },
  })
}

async function authenticate(event, settings) {
  const token = parseCookies(event.headers?.cookie || event.headers?.Cookie || '')[SESSION_COOKIE]
  if (!token) return { error: respond(401, { error: 'Authentication required.' }) }
  const response = await fetch(`${settings.url}/auth/v1/user`, {
    headers: { apikey: settings.key, Authorization: `Bearer ${token}` },
  })
  if (!response.ok) return { error: respond(401, { error: 'Your session has expired.' }) }
  const user = await response.json()
  if (!settings.adminEmails.has(user.email?.toLowerCase())) {
    return { error: respond(403, { error: 'Administrator access required.' }) }
  }
  return { user }
}

function parseBody(event) {
  try {
    return JSON.parse(event.body || '{}')
  } catch {
    return null
  }
}

function isSecure(event) {
  return (event.headers?.['x-forwarded-proto'] || '').toLowerCase() === 'https'
    || Boolean(process.env.NETLIFY)
}

function safeSearch(value) {
  return typeof value === 'string' ? value.replace(/[,*()]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100) : ''
}

async function audit(settings, reviewId, adminId, action, previousStatus = null, newStatus = null) {
  await restFetch(settings, 'review_moderation_logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ review_id: reviewId, admin_user_id: adminId, action, previous_status: previousStatus, new_status: newStatus }),
  }).catch(() => null)
}

async function login(event, settings) {
  const payload = parseBody(event)
  const email = typeof payload?.email === 'string' ? payload.email.trim().toLowerCase() : ''
  const password = typeof payload?.password === 'string' ? payload.password : ''
  if (!email || !password || password.length > 256) return respond(422, { error: 'Enter your admin email and password.' })

  const authResponse = await fetch(`${settings.url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: settings.key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!authResponse.ok) return respond(401, { error: 'Invalid email or password.' })
  const session = await authResponse.json()
  if (!settings.adminEmails.has(session.user?.email?.toLowerCase())) return respond(403, { error: 'Administrator access required.' })
  return respond(200, { user: { id: session.user.id, email: session.user.email } }, {
    'Set-Cookie': sessionCookie(session.access_token, Math.min(Number(session.expires_in) || 3600, 3600), isSecure(event)),
  })
}

async function listReviews(event, settings) {
  const query = event.queryStringParameters || {}
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1)
  const pageSize = 20
  const status = VALID_STATUSES.has(query.status) ? query.status : ''
  const rating = [1, 2, 3, 4, 5].includes(Number(query.rating)) ? Number(query.rating) : 0
  const search = safeSearch(query.search)
  const orders = {
    newest: 'created_at.desc', oldest: 'created_at.asc', highest: 'rating.desc,created_at.desc', lowest: 'rating.asc,created_at.desc',
  }
  const params = new URLSearchParams({ select: REVIEW_FIELDS, order: orders[query.sort] || orders.newest })
  if (status) params.set('status', `eq.${status}`)
  if (rating) params.set('rating', `eq.${rating}`)
  if (search) {
    const pattern = `*${search}*`
    params.set('or', `(name.ilike.${pattern},company.ilike.${pattern},email.ilike.${pattern},review.ilike.${pattern})`)
  }
  const start = (page - 1) * pageSize
  const [reviewsResponse, statsResponse] = await Promise.all([
    restFetch(settings, `reviews?${params}`, {
      headers: { Accept: 'application/json', Prefer: 'count=exact', Range: `${start}-${start + pageSize - 1}` },
    }),
    restFetch(settings, 'rpc/get_admin_review_stats', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
    }),
  ])
  if (!reviewsResponse.ok || !statsResponse.ok) return respond(502, { error: 'Unable to load review moderation data.' })
  const contentRange = reviewsResponse.headers?.get?.('content-range') || '0/0'
  const total = Number(contentRange.split('/')[1]) || 0
  const statsRows = await statsResponse.json()
  const stats = statsRows[0] || {}
  return respond(200, {
    reviews: await reviewsResponse.json(), total, page, pageSize,
    stats: {
      total: Number(stats.total_reviews) || 0,
      pending: Number(stats.pending_reviews) || 0,
      approved: Number(stats.approved_reviews) || 0,
      rejected: Number(stats.rejected_reviews) || 0,
      averageApproved: Number(stats.average_approved_rating) || 0,
    },
  })
}

async function findReview(settings, id) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id || '')) return null
  const response = await restFetch(settings, `reviews?select=${REVIEW_FIELDS}&id=eq.${encodeURIComponent(id)}&limit=1`, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error('lookup_failed')
  return (await response.json())[0] || null
}

async function updateReview(event, settings, user) {
  const payload = parseBody(event)
  if (!payload) return respond(400, { error: 'Invalid request.' })
  let review
  try { review = await findReview(settings, payload.id) } catch { return respond(502, { error: 'Unable to load this review.' }) }
  if (!review) return respond(404, { error: 'Review not found.' })

  let changes
  let action
  if (payload.action === 'status' && VALID_STATUSES.has(payload.status)) {
    changes = { status: payload.status, approved_at: payload.status === 'approved' ? new Date().toISOString() : null }
    action = payload.status === 'approved'
      ? (review.status === 'rejected' ? 'restored' : 'approved')
      : payload.status === 'pending' ? 'restored' : 'rejected'
  } else if (payload.action === 'verified' && typeof payload.isVerified === 'boolean') {
    changes = { is_verified: payload.isVerified }
    action = payload.isVerified ? 'verified' : 'unverified'
  } else {
    return respond(422, { error: 'Unsupported moderation action.' })
  }

  const response = await restFetch(settings, `reviews?id=eq.${encodeURIComponent(review.id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(changes),
  })
  if (!response.ok) return respond(502, { error: 'Unable to update this review.' })
  const updated = (await response.json())[0]
  await audit(settings, review.id, user.id, action, review.status, updated.status)
  return respond(200, { review: updated })
}

async function deleteReview(event, settings, user) {
  const payload = parseBody(event)
  if (!payload) return respond(400, { error: 'Invalid request.' })
  let review
  try { review = await findReview(settings, payload.id) } catch { return respond(502, { error: 'Unable to load this review.' }) }
  if (!review) return respond(404, { error: 'Review not found.' })
  const response = await restFetch(settings, `reviews?id=eq.${encodeURIComponent(review.id)}`, {
    method: 'DELETE', headers: { Prefer: 'return=minimal' },
  })
  if (!response.ok) return respond(502, { error: 'Unable to delete this review.' })
  await audit(settings, review.id, user.id, 'deleted', review.status, null)
  return respond(200, { deleted: true })
}

export async function handler(event) {
  const settings = config()
  if (!settings) return respond(503, { error: 'Admin moderation is not configured.' })
  const action = event.queryStringParameters?.action
  if ((event.body || '').length > 10_000) return respond(413, { error: 'Request is too large.' })

  if (event.httpMethod === 'POST' && action === 'login') return login(event, settings)
  if (event.httpMethod === 'POST' && action === 'logout') {
    return respond(200, { loggedOut: true }, { 'Set-Cookie': sessionCookie('', 0, isSecure(event)) })
  }

  const auth = await authenticate(event, settings)
  if (auth.error) return auth.error
  if (event.httpMethod === 'GET' && action === 'session') return respond(200, { user: { id: auth.user.id, email: auth.user.email } })
  if (event.httpMethod === 'GET') return listReviews(event, settings)
  if (event.httpMethod === 'PATCH') return updateReview(event, settings, auth.user)
  if (event.httpMethod === 'DELETE') return deleteReview(event, settings, auth.user)
  return respond(405, { error: 'Method not allowed.' }, { Allow: 'GET, PATCH, DELETE' })
}
