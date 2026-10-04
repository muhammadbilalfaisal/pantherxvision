import { useCallback, useEffect, useRef, useState } from 'react'
import SectionHeading from '../SectionHeading'
import ReviewCard from './ReviewCard'
import ReviewModal from './ReviewModal'
import { RatingDisplay } from './RatingStars'

export default function ReviewSection() {
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState({ count: 0, average: 0 })
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const triggerRef = useRef(null)
  const closeModal = useCallback(() => setModalOpen(false), [])

  useEffect(() => {
    const controller = new AbortController()
    fetch('/.netlify/functions/reviews?limit=6', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Unable to load reviews')
        return response.json()
      })
      .then(data => {
        setReviews(Array.isArray(data.reviews) ? data.reviews : [])
        setSummary(data.summary || { count: 0, average: 0 })
      })
      .catch(error => {
        if (error.name !== 'AbortError') setLoadError(true)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const response = await fetch(`/.netlify/functions/reviews?limit=6&offset=${reviews.length}`)
      if (!response.ok) throw new Error('Unable to load more reviews')
      const data = await response.json()
      setReviews(current => [...current, ...(Array.isArray(data.reviews) ? data.reviews : [])])
      setSummary(data.summary || summary)
    } catch {
      setLoadError(true)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <section className="py-24 relative overflow-hidden" aria-labelledby="client-reviews-heading">
      <div className="glow-blob w-[450px] h-[450px] bg-purple-900/15 top-0 right-[-120px]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <SectionHeading
              eyebrow="Client Reviews"
              title={<span id="client-reviews-heading">What Our Clients Say</span>}
              subtitle="Real experiences from businesses we've had the opportunity to work with."
            />
          </div>
          {!loading && reviews.length > 0 && (
            <button ref={triggerRef} type="button" onClick={() => setModalOpen(true)} className="btn-primary self-start lg:mb-14 whitespace-nowrap">
              Share Your Experience
            </button>
          )}
        </div>

        {!loading && summary.count > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8" aria-label={`${summary.average.toFixed(1)} out of 5 based on ${summary.count} reviews`}>
            <RatingDisplay rating={summary.average} size="text-xl" />
            <span className="font-display font-bold text-white text-lg">{summary.average.toFixed(1)}/5</span>
            <span className="text-gray-400 text-sm">Based on {summary.count} {summary.count === 1 ? 'review' : 'reviews'}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading client reviews">
            {[0, 1, 2].map(item => <div key={item} className="h-72 rounded-xl bg-brand-card border border-brand-border animate-pulse" />)}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
          </div>
        ) : (
          <div className="bg-brand-card border-glow rounded-2xl p-8 md:p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-900/40 border border-purple-700/50 flex items-center justify-center mx-auto mb-5 text-purple-300" aria-hidden="true">★</div>
            <h3 className="font-display font-bold text-white text-xl md:text-2xl">Be Among Our First Clients to Share Your Experience</h3>
            <p className="text-gray-400 mt-3 max-w-lg mx-auto">
              {loadError ? "Reviews aren't available right now, but we'd still love to hear from you." : "We'd love to hear how your experience with Panther X Vision has been."}
            </p>
            <button ref={triggerRef} type="button" onClick={() => setModalOpen(true)} className="btn-outline mt-7">Share Your Experience</button>
          </div>
        )}
        {!loading && reviews.length > 0 && reviews.length < summary.count && (
          <div className="text-center mt-10">
            <button type="button" onClick={loadMore} disabled={loadingMore} className="btn-outline disabled:opacity-60 disabled:cursor-not-allowed">
              {loadingMore ? 'Loading…' : 'View More Reviews'}
            </button>
          </div>
        )}
      </div>
      <ReviewModal open={modalOpen} onClose={closeModal} triggerRef={triggerRef} />
    </section>
  )
}
