export default function SectionHeading({ eyebrow, title, subtitle, center = false }) {
  return (
    <div className={`mb-14 ${center ? 'text-center' : ''}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 mb-3 font-display">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl ${center ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
