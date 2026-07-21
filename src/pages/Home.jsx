import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'

const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Social Media Marketing',
    desc: 'We build and manage high-performing social media presences that grow your audience, spark engagement, and convert followers into loyal customers.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
    title: 'Search Engine Optimization',
    desc: 'Dominate search results with our data-driven SEO strategies — technical audits, content optimization, and authority link building that drive organic growth.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Pay-Per-Click Advertising',
    desc: 'Maximize ROI with precisely targeted Google and Meta ad campaigns. We manage every rupee to ensure you get the highest returns on your ad spend.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'Content Marketing',
    desc: 'Compelling content that educates, entertains, and converts. From blog posts and videos to infographics, we craft narratives that resonate with your audience.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Brand Strategy',
    desc: 'From brand identity and positioning to messaging frameworks, we help you build a brand that stands out, resonates with your target market, and commands premium.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
      </svg>
    ),
    title: 'Web Design & Development',
    desc: 'High-converting, visually stunning websites built for performance. We design digital experiences that reflect your brand and turn visitors into paying clients.',
  },
]

const stats = [
  { number: '50+', label: 'Clients Served' },
  { number: '3x', label: 'Average ROI Delivered' },
  { number: '98%', label: 'Client Retention Rate' },
  { number: '5+', label: 'Years of Experience' },
]

const process = [
  {
    step: 'Discover',
    desc: 'We dive deep into your business, audience, and competitors. Every strategy starts with understanding what makes you different and where the real growth opportunities lie.',
  },
  {
    step: 'Strategize',
    desc: 'We craft a custom digital marketing blueprint tailored to your goals — no cookie-cutter templates, just a focused plan built for results.',
  },
  {
    step: 'Execute',
    desc: 'Our team activates the strategy across the right channels with precision — from paid ads and SEO to content and social media — with full transparency.',
  },
  {
    step: 'Optimize',
    desc: 'We track, analyze, and continuously improve every campaign. Data drives every decision so your investment keeps compounding over time.',
  },
]

const marqueeItems = [
  'Social Media Marketing',
  'SEO',
  'PPC Advertising',
  'Brand Strategy',
  'Content Marketing',
  'Web Design',
  'Growth Marketing',
  'Email Campaigns',
]

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Glow blobs */}
        <div className="glow-blob w-[600px] h-[600px] bg-purple-900/30 top-[-100px] left-[-150px]" />
        <div className="glow-blob w-[400px] h-[400px] bg-purple-700/20 bottom-[-50px] right-[-100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 mb-6 font-display fade-in-up">
              <span className="w-6 h-px bg-purple-500" />
              Digital Marketing Agency — Karachi
            </span>
            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-[1.08] mb-6 fade-in-up delay-1">
              We Don't Just{' '}
              <span className="text-gradient">Market.</span>
              <br />We Make You{' '}
              <span className="text-gradient-purple">Unstoppable.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-10 fade-in-up delay-2">
              Panther X Vision is a growth-obsessed digital marketing agency that helps ambitious brands dominate their markets through bold strategy, sharp execution, and measurable results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 fade-in-up delay-3">
              <Link to="/contact" className="btn-primary text-base text-center">
                Get a Free Strategy Call
              </Link>
              <Link to="/services" className="btn-outline text-base text-center">
                Explore Our Services
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-10 border-t border-brand-border fade-in-up delay-4">
              {stats.map(({ number, label }) => (
                <div key={label}>
                  <div className="font-display font-bold text-3xl text-gradient-purple">{number}</div>
                  <div className="text-gray-500 text-sm mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark to-transparent" />
      </section>

      {/* MARQUEE */}
      <section className="py-5 border-y border-brand-border overflow-hidden bg-brand-card/50">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-6 px-6 text-sm font-display font-medium text-gray-400 uppercase tracking-widest whitespace-nowrap">
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
            </span>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 relative overflow-hidden">
        <div className="glow-blob w-[500px] h-[500px] bg-purple-900/20 top-0 right-[-150px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            eyebrow="What We Do"
            title={<>Services Built for <span className="text-gradient-purple">Real Growth</span></>}
            subtitle="From strategy to execution, we offer a full suite of digital marketing services designed to put your brand in front of the right people — and convert them."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon, title, desc }) => (
              <div key={title} className="bg-brand-card border-glow rounded-xl p-7 card-hover">
                <div className="w-12 h-12 rounded-lg bg-purple-900/40 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-5">
                  {icon}
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/services" className="btn-outline">View All Services</Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 bg-brand-card/40 border-y border-brand-border relative overflow-hidden">
        <div className="glow-blob w-[400px] h-[400px] bg-purple-800/15 bottom-0 left-[-100px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading
                eyebrow="Why Panther X Vision"
                title={<>Marketing That <span className="text-gradient-purple">Moves the Needle</span></>}
                subtitle="We're not a typical agency that reports vanity metrics. We obsess over what actually matters — qualified leads, revenue, and market share."
              />
              <ul className="space-y-5">
                {[
                  { title: 'Strategy First', desc: 'Every campaign starts with deep research — your market, competitors, and target audience.' },
                  { title: 'Transparent Reporting', desc: 'You get real-time access to dashboards showing exactly where your budget goes and what it returns.' },
                  { title: 'Full-Funnel Thinking', desc: 'We don\'t just drive traffic. We optimize the entire customer journey from awareness to conversion.' },
                  { title: 'Pakistan Market Expertise', desc: 'Deep understanding of local digital consumer behavior across Karachi and beyond.' },
                ].map(({ title, desc }) => (
                  <li key={title} className="flex items-start gap-4">
                    <div className="w-5 h-5 rounded-full bg-purple-900/50 border border-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <span className="font-display font-semibold text-white text-sm">{title} — </span>
                      <span className="text-gray-400 text-sm">{desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Visual side */}
            <div className="relative">
              <div className="bg-brand-card border-glow rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-700/10 rounded-full blur-3xl" />
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { label: 'Campaigns Launched', value: '200+' },
                    { label: 'Revenue Generated', value: '₨ 50M+' },
                    { label: 'Avg. Lead Cost Reduction', value: '40%' },
                    { label: 'Industries Served', value: '15+' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-brand-dark/60 rounded-xl p-5 border border-brand-border">
                      <div className="font-display font-bold text-2xl text-gradient-purple">{value}</div>
                      <div className="text-gray-500 text-xs mt-1 leading-tight">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 bg-brand-dark/60 rounded-xl p-5 border border-brand-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-xs font-medium">Client Growth Rate</span>
                    <span className="text-purple-400 text-xs font-semibold">+127% avg.</span>
                  </div>
                  <div className="w-full bg-brand-border rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-700 to-purple-400 h-2 rounded-full" style={{ width: '78%' }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600 text-xs">Before PXV</span>
                    <span className="text-gray-600 text-xs">After PXV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 relative overflow-hidden">
        <div className="glow-blob w-[500px] h-[300px] bg-purple-900/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Process"
            title={<>How We Turn Vision <span className="text-gradient-purple">Into Results</span></>}
            subtitle="A focused 4-step approach that takes your brand from where it is to where it deserves to be."
            center
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map(({ step, desc }, i) => (
              <div key={step} className="relative bg-brand-card border-glow rounded-xl p-7 card-hover">
                <div className="font-display font-bold text-5xl text-purple-900/60 mb-4 leading-none">
                  0{i + 1}
                </div>
                <h3 className="font-display font-bold text-white text-xl mb-3">{step}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-purple-700/40" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-24 bg-brand-card/40 border-y border-brand-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 mb-8 font-display">
            Client Results
          </span>
          <blockquote className="font-display font-medium text-2xl md:text-3xl text-white leading-relaxed mb-8">
            "Panther X Vision completely transformed how we approach digital. Our social media engagement tripled in 90 days and we saw a 2.4x return on ad spend within the first month."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center font-display font-bold text-white">A</div>
            <div className="text-left">
              <div className="text-white font-semibold text-sm">Ahmed Raza</div>
              <div className="text-gray-500 text-xs">CEO, TechBridge Solutions, Karachi</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="glow-blob w-[700px] h-[400px] bg-purple-900/25 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 mb-4 font-display">
            Ready to Grow?
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6 leading-tight">
            Let's Build Something <span className="text-gradient-purple">Remarkable Together</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Book a free 30-minute strategy session. We'll audit your current digital presence and map out exactly how to accelerate your growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary text-base">
              Book Your Free Strategy Call
            </Link>
            <Link to="/services" className="btn-outline text-base">
              See Our Services
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
