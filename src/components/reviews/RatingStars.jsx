const starValues = [1, 2, 3, 4, 5]

export function RatingDisplay({ rating, size = 'text-base' }) {
  return (
    <span className={`inline-flex gap-0.5 text-amber-400 ${size}`} aria-label={`${rating} out of 5 stars`}>
      {starValues.map(value => (
        <span key={value} aria-hidden="true">{value <= Math.round(rating) ? '★' : '☆'}</span>
      ))}
    </span>
  )
}

export function RatingInput({ value, hoverValue, onChange, onHover, error }) {
  const activeValue = hoverValue || value

  const handleKeyDown = event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      onChange(Math.min(5, (value || 0) + 1))
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      onChange(Math.max(1, (value || 1) - 1))
    }
  }

  return (
    <fieldset>
      <legend className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 font-display">
        Rating *
      </legend>
      <div
        className="inline-flex gap-1"
        onMouseLeave={() => onHover(0)}
        onKeyDown={handleKeyDown}
        role="radiogroup"
        aria-describedby={error ? 'rating-error' : 'rating-help'}
      >
        {starValues.map(star => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`Rating: ${star} out of 5`}
            onClick={() => onChange(star)}
            onMouseEnter={() => onHover(star)}
            className={`min-w-11 min-h-11 text-3xl leading-none transition-colors ${
              star <= activeValue ? 'text-amber-400' : 'text-gray-600 hover:text-amber-300'
            }`}
          >
            <span aria-hidden="true">{star <= activeValue ? '★' : '☆'}</span>
          </button>
        ))}
      </div>
      <p id="rating-help" className="sr-only">Use the arrow keys or select a star from 1 to 5.</p>
      {error && <p id="rating-error" className="text-red-400 text-xs mt-1" role="alert">{error}</p>}
    </fieldset>
  )
}
