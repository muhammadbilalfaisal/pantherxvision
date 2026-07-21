import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

const pageMetadata = {
  '/': {
    title: 'Panther X Vision | Digital Marketing Agency in Karachi',
    description: 'Growth-driven digital marketing, SEO, paid advertising, branding, and web design for ambitious businesses in Karachi and beyond.',
  },
  '/about': {
    title: 'About Us | Panther X Vision',
    description: 'Meet Panther X Vision, a Karachi digital marketing agency built around bold strategy, transparent reporting, and measurable growth.',
  },
  '/services': {
    title: 'Digital Marketing Services | Panther X Vision',
    description: 'Explore social media marketing, SEO, PPC, content, brand strategy, and web design services from Panther X Vision.',
  },
  '/contact': {
    title: 'Contact Panther X Vision | Book a Strategy Call',
    description: 'Contact Panther X Vision to book a free digital growth strategy call for your business.',
  },
}

function updateMeta(name, content, attribute = 'name') {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function PageMetadata() {
  const { pathname } = useLocation()

  useEffect(() => {
    const metadata = pageMetadata[pathname] ?? {
      title: 'Page Not Found | Panther X Vision',
      description: 'The requested Panther X Vision page could not be found.',
    }
    const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '')
    const canonicalUrl = `${siteUrl}${pathname === '/' ? '' : pathname}`

    document.title = metadata.title
    updateMeta('description', metadata.description)
    updateMeta('og:title', metadata.title, 'property')
    updateMeta('og:description', metadata.description, 'property')
    updateMeta('og:url', canonicalUrl, 'property')

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)
  }, [pathname])

  return null
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageMetadata />
      <div className="min-h-screen flex flex-col bg-brand-dark">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
