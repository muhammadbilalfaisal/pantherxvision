import { useState } from 'react'
import { RatingDisplay } from './RatingStars'

const PREVIEW_LENGTH = 280

export default function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = review.review.length > PREVIEW_LENGTH
  const visibleReview = !isLong || expanded
    ? review.review
    : `${review.review.slice(0, PREVIEW_LENGTH).trimEnd()}…`
  const initials = review.name
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()

  return (
    <article className="bg-brand-card border-glow rounded-xl p-7 card-hover flex flex-col h-full">
      <RatingDisplay rating={review.rating} />
      <blockquote className="text-gray-300 text-sm leading-relaxed mt-5 flex-1">
        “{visibleReview}”
      </blockquote>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(current => !current)}
          className="self-start mt-3 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          aria-expanded={expanded}
        >
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      )}
      <footer className="mt-6 pt-5 border-t border-brand-border flex items-center gap-3">
        {review.avatar_url ? (
          <img
            src={review.avatar_url}
            alt=""
            loading="lazy"
            className="w-11 h-11 rounded-full object-cover border border-purple-800/50"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-purple-900/60 border border-purple-700/50 flex items-center justify-center font-display font-bold text-purple-200" aria-hidden="true">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <cite className="not-italic font-display font-semibold text-white text-sm block truncate">{review.name}</cite>
          {(review.job_title || review.company) && (
            <p className="text-gray-400 text-xs mt-0.5 truncate">
              {[review.job_title, review.company].filter(Boolean).join(', ')}
            </p>
          )}
          {review.is_verified && (
            <p className="text-purple-400 text-xs font-semibold mt-1" aria-label="Verified client">
              <span aria-hidden="true">✓</span> Verified Client
            </p>
          )}
        </div>
      </footer>
    </article>
  )
}
