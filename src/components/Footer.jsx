import { Link } from 'react-router-dom'

export default function Footer() {
  const services = [
    'Social Media Marketing',
    'Search Engine Optimization',
    'Pay-Per-Click Advertising',
    'Content Marketing',
    'Brand Strategy',
    'Web Design & Development',
  ]

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/services', label: 'Services' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <footer className="bg-brand-card border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src="/logo.svg" alt="Panther X Vision" className="h-10 w-auto mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              A growth-driven digital marketing agency helping businesses dominate their market through bold strategy and measurable results.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.facebook.com/profile.php?id=61585249958576#" target="_blank" rel="noreferrer" aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-brand-border flex items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/panther_x_vision/" target="_blank" rel="noreferrer" aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-brand-border flex items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/pantherxvision-marketing-agency/" target="_blank" rel="noreferrer" aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-brand-border flex items-center justify-center text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-400 text-sm hover:text-purple-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-widest">Services</h4>
            <ul className="space-y-3">
              {services.map(s => (
                <li key={s}>
                  <Link to="/services" className="text-gray-400 text-sm hover:text-purple-400 transition-colors">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm uppercase tracking-widest">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="text-gray-400 text-sm">Karachi, Pakistan</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href="mailto:info@pantherxvision.com" className="text-gray-400 text-sm hover:text-purple-400 transition-colors">
                  info@pantherxvision.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                <a href="tel:+923150288320" className="text-gray-400 text-sm hover:text-purple-400 transition-colors">
                  +92 315 0288320
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Panther X Vision. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Strategy • Branding • Marketing • Growth
          </p>
        </div>
      </div>
    </footer>
  )
}
