import { useEffect, useId, useRef, useState } from 'react'
import { RatingInput } from './RatingStars'

const initialForm = {
  rating: 0,
  name: '',
  company: '',
  jobTitle: '',
  email: '',
  review: '',
  website: '',
}

const focusableSelector = 'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

function validate(form) {
  const errors = {}
  if (!Number.isInteger(form.rating) || form.rating < 1 || form.rating > 5) errors.rating = 'Choose a rating from 1 to 5.'
  if (!form.name.trim()) errors.name = 'Your name is required.'
  else if (form.name.trim().length > 80) errors.name = 'Name must be 80 characters or fewer.'
  if (!form.review.trim()) errors.review = 'Your review is required.'
  else if (form.review.trim().length < 40) errors.review = 'Please share at least 40 characters.'
  else if (form.review.trim().length > 1200) errors.review = 'Review must be 1,200 characters or fewer.'
  if (form.company.trim().length > 120) errors.company = 'Company must be 120 characters or fewer.'
  if (form.jobTitle.trim().length > 120) errors.jobTitle = 'Job title must be 120 characters or fewer.'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  return errors
}

export default function ReviewModal({ open, onClose, triggerRef }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const [hoverRating, setHoverRating] = useState(0)
  const startedAtRef = useRef(0)
  const dialogRef = useRef(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (!open) return undefined
    startedAtRef.current = Date.now()
    const triggerElement = triggerRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const firstFocusable = dialogRef.current?.querySelector(focusableSelector)
    firstFocusable?.focus()

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = [...(dialogRef.current?.querySelectorAll(focusableSelector) || [])]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      triggerElement?.focus()
    }
  }, [open, onClose, triggerRef])

  if (!open) return null

  const handleChange = event => {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
    if (errors[name]) setErrors(current => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setStatus('submitting')
    setSubmitError('')
    try {
      const response = await fetch('/.netlify/functions/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, startedAt: startedAtRef.current }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Something went wrong while submitting your review.')
      setStatus('success')
      setForm(initialForm)
    } catch (error) {
      setSubmitError(error.message || 'Something went wrong while submitting your review. Please try again.')
      setStatus('error')
    }
  }

  const inputClass = name => `w-full bg-brand-dark border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors font-body ${errors[name] ? 'border-red-500' : 'border-brand-border focus:border-purple-600'}`
  return (
    <div
      className="fixed inset-0 z-[100] bg-brand-dark/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 fade-in-up"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-brand-card border-glow rounded-2xl p-6 sm:p-8 relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-lg border border-brand-border text-gray-400 hover:text-white hover:border-purple-600 transition-colors"
          aria-label="Close review form"
        >
          <span aria-hidden="true" className="text-2xl leading-none">×</span>
        </button>

        {status === 'success' ? (
          <div className="text-center py-10" aria-live="polite">
            <div className="w-16 h-16 rounded-full bg-purple-900/50 border border-purple-600 flex items-center justify-center mx-auto mb-5 text-purple-300 text-2xl" aria-hidden="true">✓</div>
            <h2 id={titleId} className="font-display font-bold text-white text-2xl mb-3">Thank You!</h2>
            <p id={descriptionId} className="text-gray-400 leading-relaxed max-w-md mx-auto">
              Thank you for sharing your experience with Panther X Vision. Your review has been submitted and is currently awaiting approval.
            </p>
            <button type="button" onClick={onClose} className="btn-primary mt-8">Done</button>
          </div>
        ) : (
          <>
            <h2 id={titleId} className="font-display font-bold text-white text-2xl sm:text-3xl pr-12">Share Your Experience</h2>
            <p id={descriptionId} className="text-gray-400 mt-2 mb-7">How was your experience with Panther X Vision?</p>
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <RatingInput
                value={form.rating}
                hoverValue={hoverRating}
                onHover={setHoverRating}
                onChange={rating => {
                  setForm(current => ({ ...current, rating }))
                  setErrors(current => ({ ...current, rating: undefined }))
                }}
                error={errors.rating}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Name *" name="name" error={errors.name}>
                  <input id="review-name" name="name" value={form.name} onChange={handleChange} maxLength={80} autoComplete="name" className={inputClass('name')} />
                </Field>
                <Field label="Email" name="email" error={errors.email} hint="Never displayed publicly">
                  <input id="review-email" type="email" name="email" value={form.email} onChange={handleChange} maxLength={254} autoComplete="email" className={inputClass('email')} />
                </Field>
                <Field label="Company / Organization" name="company" error={errors.company}>
                  <input id="review-company" name="company" value={form.company} onChange={handleChange} maxLength={120} autoComplete="organization" className={inputClass('company')} />
                </Field>
                <Field label="Job Title" name="jobTitle" error={errors.jobTitle}>
                  <input id="review-jobTitle" name="jobTitle" value={form.jobTitle} onChange={handleChange} maxLength={120} autoComplete="organization-title" className={inputClass('jobTitle')} />
                </Field>
              </div>
              <Field label="Review *" name="review" error={errors.review}>
                <textarea id="review-review" name="review" value={form.review} onChange={handleChange} minLength={40} maxLength={1200} rows={6} className={`${inputClass('review')} resize-y`} />
                <span className="block text-right text-xs text-gray-500 mt-1">{form.review.length}/1,200</span>
              </Field>
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="review-website">Website</label>
                <input id="review-website" name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
              </div>
              {submitError && <p className="text-red-400 text-sm" role="alert">{submitError}</p>}
              <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full text-center disabled:opacity-60 disabled:cursor-not-allowed">
                {status === 'submitting' ? 'Submitting…' : 'Submit Review'}
              </button>
              <p className="text-gray-500 text-xs text-center">Reviews are moderated before they appear publicly.</p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function Field({ label, name, error, hint, children }) {
  return (
    <div>
      <label htmlFor={`review-${name}`} className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 font-display">{label}</label>
      {children}
      {hint && !error && <p className="text-gray-500 text-xs mt-1">{hint}</p>}
      {error && <p className="text-red-400 text-xs mt-1" role="alert">{error}</p>}
    </div>
  )
}
