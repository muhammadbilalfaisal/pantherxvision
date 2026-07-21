import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'

const values = [
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    title: 'Bold Execution',
    desc: 'We move fast and act decisively. Half-measures are not in our vocabulary — we go all in on every campaign.',
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    title: 'Radical Transparency',
    desc: 'You always know exactly what we\'re doing and why. No hidden fees, no jargon, no BS — just clear results.',
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'Data Over Gut',
    desc: 'Every decision we make is backed by real numbers. We track what matters and optimize relentlessly.',
  },
  {
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    title: 'Client Partnership',
    desc: 'We treat your business as our own. Your success is our success — we\'re partners, not just vendors.',
  },
]

const team = [
  { name: 'Tehreem Kanwal', role: 'CEO', initial: 'T' },
]

export default function About() {
  return (
    <>
      {/* Page Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="glow-blob w-[500px] h-[400px] bg-purple-900/25 top-0 left-1/2 -translate-x-1/2" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 mb-4 font-display">
            About Us
          </span>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white mb-6 leading-tight">
            The Agency Built for <span className="text-gradient-purple">Ambitious Brands</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Panther X Vision was founded in Karachi with one mission: to help Pakistani and global businesses compete and win in the digital arena through strategy that actually works.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 relative overflow-hidden">
        <div className="glow-blob w-[400px] h-[400px] bg-purple-800/15 top-0 right-[-100px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading
                eyebrow="Our Story"
                title={<>Started With a <span className="text-gradient-purple">Clear Purpose</span></>}
              />
              <div className="space-y-4 text-gray-400 leading-relaxed text-base">
                <p>
                  We started Panther X Vision because we saw too many businesses in Karachi wasting their marketing budgets on agencies that promised the moon and delivered mediocre social posts. We knew there had to be a better way.
                </p>
                <p>
                  The name says it all — a panther doesn't chase every opportunity. It watches, studies, picks the right moment, and strikes with precision. That's exactly how we approach every client engagement.
                </p>
                <p>
                  Today, we work with businesses across e-commerce, real estate, healthcare, fintech, and retail — helping them build digital brands that generate consistent, scalable revenue.
                </p>
              </div>
              <div className="mt-8">
                <Link to="/contact" className="btn-primary">Start Your Growth Journey</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                { value: '5+', label: 'Years in Business' },
                { value: '50+', label: 'Happy Clients' },
                { value: '200+', label: 'Campaigns Run' },
                { value: '15+', label: 'Industries Served' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-brand-card border-glow rounded-xl p-7 text-center card-hover">
                  <div className="font-display font-bold text-4xl text-gradient-purple mb-2">{value}</div>
                  <div className="text-gray-400 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-brand-card/40 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Values"
            title={<>What Drives <span className="text-gradient-purple">Everything We Do</span></>}
            center
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="bg-brand-card border-glow rounded-xl p-7 card-hover text-center">
                <div className="w-12 h-12 rounded-lg bg-purple-900/40 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-5 mx-auto">
                  {icon}
                </div>
                <h3 className="font-display font-semibold text-white text-base mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 relative overflow-hidden">
        <div className="glow-blob w-[400px] h-[400px] bg-purple-900/15 bottom-0 left-[-100px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Team"
            title={<>The Minds Behind <span className="text-gradient-purple">Your Growth</span></>}
            subtitle="A tight-knit team of strategists, creatives, and data nerds obsessed with getting you results."
            center
          />
          <div className="max-w-xs mx-auto">
            {team.map(({ name, role, initial }) => (
              <div key={name} className="bg-brand-card border-glow rounded-xl p-7 text-center card-hover">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center font-display font-bold text-2xl text-white mx-auto mb-5">
                  {initial}
                </div>
                <h3 className="font-display font-semibold text-white text-base mb-1">{name}</h3>
                <p className="text-purple-400 text-sm">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-card/40 border-t border-brand-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-4xl text-white mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-gray-400 mb-8">Let's talk about your goals and map out how we can help you get there.</p>
          <Link to="/contact" className="btn-primary text-base">Book a Free Consultation</Link>
        </div>
      </section>
    </>
  )
}
