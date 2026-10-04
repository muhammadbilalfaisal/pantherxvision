import { useState } from 'react'
import { m } from 'framer-motion'

export default function AdminLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async event => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const response = await fetch('/.netlify/functions/admin-reviews?action=login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to sign in.')
      onLogin(data.user)
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-5">
      <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl bg-brand-card border-glow p-7 sm:p-9">
        <img src="/logo.png" alt="Panther X Vision" className="h-14 w-auto mb-7" width="1000" height="500" />
        <h1 className="font-display text-3xl font-bold text-white">Admin sign in</h1>
        <p className="mt-2 text-sm text-gray-400">Sign in with an authorized Panther X Vision admin account.</p>
        <form onSubmit={submit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 font-display">Email</label>
            <input id="admin-email" type="email" autoComplete="username" required value={credentials.email} onChange={event => setCredentials(current => ({ ...current, email: event.target.value }))} className="w-full rounded-lg border border-brand-border bg-brand-dark px-4 py-3 text-sm text-white focus:border-purple-600 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 font-display">Password</label>
            <input id="admin-password" type="password" autoComplete="current-password" required value={credentials.password} onChange={event => setCredentials(current => ({ ...current, password: event.target.value }))} className="w-full rounded-lg border border-brand-border bg-brand-dark px-4 py-3 text-sm text-white focus:border-purple-600 focus:outline-none" />
          </div>
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">{submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </m.div>
    </div>
  )
}
