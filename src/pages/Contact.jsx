import { useState } from 'react'
const services = [
  'Social Media Marketing',
  'Search Engine Optimization',
  'Pay-Per-Click Advertising',
  'Content Marketing',
  'Brand Strategy & Identity',
  'Web Design & Development',
  'Full-Service Retainer',
]

const budgets = [
  'Under ₨50,000/month',
  '₨50,000 – ₨150,000/month',
  '₨150,000 – ₨300,000/month',
  '₨300,000+/month',
  'Not sure yet',
]

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', service: '', budget: '', message: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT
      if (!endpoint) {
        throw new Error('VITE_FORMSPREE_ENDPOINT is not configured')
      }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputCls = 'w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-600 transition-colors font-body'
  const labelCls = 'block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 font-display'

  return (
    <>
      {/* Page Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="glow-blob w-[500px] h-[400px] bg-purple-900/25 top-0 left-1/2 -translate-x-1/2" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 mb-4 font-display">
            Get In Touch
          </span>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white mb-6 leading-tight">
            Let's Start Your <span className="text-gradient-purple">Growth Story</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Book a free 30-minute strategy session. No hard sell — just an honest conversation about your goals and how we can help.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-24 relative overflow-hidden">
        <div className="glow-blob w-[400px] h-[400px] bg-purple-800/15 bottom-0 right-[-100px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Info panel */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact info */}
              <div className="bg-brand-card border-glow rounded-2xl p-8">
                <h3 className="font-display font-bold text-white text-xl mb-6">Contact Information</h3>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-900/40 border border-purple-800/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-display mb-1">Location</div>
                      <div className="text-white text-sm">Karachi, Pakistan</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-900/40 border border-purple-800/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-display mb-1">Email</div>
                      <a href="mailto:info@pantherxvision.com" className="text-white text-sm hover:text-purple-400 transition-colors">info@pantherxvision.com</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-900/40 border border-purple-800/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-display mb-1">Phone / WhatsApp</div>
                      <a href="tel:+923150288320" className="text-white text-sm hover:text-purple-400 transition-colors">+92 315 0288320</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-900/40 border border-purple-800/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-display mb-1">Working Hours</div>
                      <div className="text-white text-sm">Mon – Sat, 9:00 AM – 7:00 PM PKT</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* What to expect */}
              <div className="bg-brand-card border-glow rounded-2xl p-8">
                <h3 className="font-display font-bold text-white text-lg mb-5">What Happens Next?</h3>
                <ul className="space-y-4">
                  {[
                    'We review your submission within 24 hours',
                    'Schedule a free 30-min strategy call',
                    'We audit your current digital presence',
                    'You receive a custom growth proposal',
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-900/50 border border-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-300 text-xs font-bold font-display">{i + 1}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-brand-card border-glow rounded-2xl p-8 md:p-10">
                <h3 className="font-display font-bold text-white text-2xl mb-2">Send Us a Message</h3>
                <p className="text-gray-500 text-sm mb-8">Fill in your details and we'll get back to you within one business day.</p>

                {status === 'success' ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-purple-900/50 border border-purple-600 flex items-center justify-center mx-auto mb-5">
                      <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h4 className="font-display font-bold text-white text-xl mb-2">Message Received!</h4>
                    <p className="text-gray-400 text-sm">We'll be in touch within 24 hours to schedule your free strategy call.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className={labelCls}>Full Name *</label>
                        <input id="name" type="text" name="name" autoComplete="name" required value={form.name} onChange={handleChange}
                          placeholder="Your full name" className={inputCls} />
                      </div>
                      <div>
                        <label htmlFor="email" className={labelCls}>Email Address *</label>
                        <input id="email" type="email" name="email" autoComplete="email" required value={form.email} onChange={handleChange}
                          placeholder="you@company.com" className={inputCls} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="phone" className={labelCls}>Phone / WhatsApp</label>
                        <input id="phone" type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={handleChange}
                          placeholder="+92 300 0000000" className={inputCls} />
                      </div>
                      <div>
                        <label htmlFor="company" className={labelCls}>Company Name</label>
                        <input id="company" type="text" name="company" autoComplete="organization" value={form.company} onChange={handleChange}
                          placeholder="Your company" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="service" className={labelCls}>Service Interested In</label>
                      <select id="service" name="service" value={form.service} onChange={handleChange} className={inputCls}>
                        <option value="">Select a service...</option>
                        {services.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="budget" className={labelCls}>Monthly Budget</label>
                      <select id="budget" name="budget" value={form.budget} onChange={handleChange} className={inputCls}>
                        <option value="">Select budget range...</option>
                        {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className={labelCls}>Tell Us About Your Goals *</label>
                      <textarea id="message" name="message" required value={form.message} onChange={handleChange}
                        rows={5} placeholder="What are you trying to achieve? What challenges are you facing?"
                        className={inputCls + ' resize-none'} />
                    </div>
                    {status === 'error' && (
                      <p className="text-red-400 text-sm" role="alert">Something went wrong. Please try again or email us directly.</p>
                    )}
                    <button type="submit" disabled={status === 'sending'}
                      className="btn-primary w-full text-center text-base disabled:opacity-60">
                      {status === 'sending' ? 'Sending...' : 'Send Message & Book Strategy Call'}
                    </button>
                    <p className="text-gray-600 text-xs text-center">
                      By submitting, you agree to be contacted by Panther X Vision. We never share your information.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
