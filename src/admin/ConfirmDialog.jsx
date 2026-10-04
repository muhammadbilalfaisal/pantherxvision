import { useEffect, useRef } from 'react'
import { m } from 'framer-motion'

export default function ConfirmDialog({ title, description, confirmLabel, destructive = false, busy, onConfirm, onClose }) {
  const cancelRef = useRef(null)
  useEffect(() => {
    const previous = document.activeElement
    cancelRef.current?.focus()
    const onKeyDown = event => { if (event.key === 'Escape' && !busy) onClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('keydown', onKeyDown); previous?.focus?.() }
  }, [busy, onClose])

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-brand-dark/85 p-4 backdrop-blur-sm" onMouseDown={event => { if (event.target === event.currentTarget && !busy) onClose() }}>
      <m.div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-2xl bg-brand-card border-glow p-7">
        <h2 id="confirm-title" className="font-display text-xl font-bold text-white">{title}</h2>
        <p id="confirm-description" className="mt-3 text-sm leading-relaxed text-gray-400">{description}</p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button ref={cancelRef} type="button" onClick={onClose} disabled={busy} className="btn-outline disabled:opacity-60">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={busy} className={destructive ? 'rounded-md bg-red-700 px-6 py-3 font-display font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60' : 'btn-primary disabled:opacity-60'}>{busy ? 'Working…' : confirmLabel}</button>
        </div>
      </m.div>
    </div>
  )
}
