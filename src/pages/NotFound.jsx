import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 pt-28 pb-20 text-center">
      <div className="max-w-xl">
        <p className="font-display font-bold text-7xl text-gradient-purple mb-4">404</p>
        <h1 className="font-display font-bold text-4xl text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The page you requested does not exist or may have moved.
        </p>
        <Link to="/" className="btn-primary">Return Home</Link>
      </div>
    </section>
  )
}
