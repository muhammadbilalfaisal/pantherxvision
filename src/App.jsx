import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { pageMetadata, publicPages, SITE_URL } from './config/seo'

const pageComponents = {
  '/': <Home />,
  '/about': <About />,
  '/services': <Services />,
  '/contact': <Contact />,
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
    const isPublicPage = Boolean(pageMetadata[pathname])
    const metadata = pageMetadata[pathname] ?? {
      title: 'Page Not Found | Panther X Vision',
      description: 'The requested Panther X Vision page could not be found.',
    }
    const canonicalUrl = `${SITE_URL}${pathname === '/' ? '' : pathname}`

    document.title = metadata.title
    updateMeta('description', metadata.description)
    updateMeta('robots', isPublicPage ? 'index, follow' : 'noindex, nofollow')
    updateMeta('og:title', metadata.title, 'property')
    updateMeta('og:description', metadata.description, 'property')
    updateMeta('og:url', canonicalUrl, 'property')
    updateMeta('og:type', 'website', 'property')
    updateMeta('twitter:card', 'summary')
    updateMeta('twitter:title', metadata.title)
    updateMeta('twitter:description', metadata.description)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    if (isPublicPage) {
      canonical.setAttribute('href', canonicalUrl)
    } else {
      canonical.remove()
    }
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
            {publicPages.map(({ path }) => (
              <Route key={path} path={path} element={pageComponents[path]} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
