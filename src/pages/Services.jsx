import { Link } from 'react-router-dom'
const services = [
  {
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    title: 'Social Media Marketing',
    tagline: 'Build. Engage. Convert.',
    desc: 'We build and manage high-performing social media presences across Facebook, Instagram, TikTok, LinkedIn, and Twitter. From content strategy and community management to paid social campaigns, we turn your social channels into a reliable lead generation machine.',
    features: ['Platform strategy & setup', 'Content calendar creation', 'Daily/weekly posting', 'Community management', 'Paid social campaigns', 'Monthly performance reports'],
  },
  {
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
    title: 'Search Engine Optimization',
    tagline: 'Rank. Traffic. Revenue.',
    desc: 'Dominate Google search results with our comprehensive SEO strategies. We handle everything from technical audits and on-page optimization to content strategy and link building — driving consistent organic traffic that compounds over time.',
    features: ['Technical SEO audit', 'Keyword research & mapping', 'On-page optimization', 'Content strategy', 'Link building campaigns', 'Local SEO (Pakistan)'],
  },
  {
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'Pay-Per-Click Advertising',
    tagline: 'Targeted. Measurable. Scalable.',
    desc: 'Get immediate, qualified traffic with our data-driven PPC campaigns on Google Ads and Meta Ads. We manage every aspect — from keyword targeting and ad copywriting to bid optimization and conversion tracking — ensuring maximum ROI on every rupee spent.',
    features: ['Google Search & Display Ads', 'Meta (Facebook/Instagram) Ads', 'Campaign structure & setup', 'A/B ad testing', 'Conversion tracking setup', 'Weekly optimization & reporting'],
  },
  {
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    title: 'Content Marketing',
    tagline: 'Stories That Sell.',
    desc: 'Compelling, strategic content that educates your audience, builds trust, and drives action. We develop content strategies and create everything from blog posts, video scripts, and infographics to email newsletters and lead magnets.',
    features: ['Content strategy & planning', 'Blog writing & publishing', 'Video scripts & storyboards', 'Infographic design', 'Email newsletter campaigns', 'Lead magnet creation'],
  },
  {
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    title: 'Brand Strategy & Identity',
    tagline: 'Be Unforgettable.',
    desc: 'Your brand is more than a logo — it\'s the entire experience customers have with your business. We craft comprehensive brand strategies including positioning, messaging, visual identity, and brand guidelines that make you stand out and command premium.',
    features: ['Brand positioning workshop', 'Target audience profiling', 'Brand identity design', 'Messaging framework', 'Brand voice & tone guidelines', 'Competitor analysis'],
  },
  {
    icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
    title: 'Web Design & Development',
    tagline: 'Beautiful. Fast. Converting.',
    desc: 'High-converting websites that look stunning and perform even better. We design and build custom websites optimized for speed, SEO, and conversions — because your website should be your hardest-working sales tool.',
    features: ['Custom UI/UX design', 'Responsive development', 'CMS integration', 'Landing page design', 'Speed & performance optimization', 'Conversion rate optimization'],
  },
]

export default function Services() {
  return (
    <>
      {/* Page Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="glow-blob w-[500px] h-[400px] bg-purple-900/25 top-0 left-1/2 -translate-x-1/2" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 mb-4 font-display">
            Our Services
          </span>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white mb-6 leading-tight">
            Everything You Need to <span className="text-gradient-purple">Win Online</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A full suite of digital marketing services, each built around a single goal: growing your business with measurable, repeatable results.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-24 relative overflow-hidden">
        <div className="glow-blob w-[400px] h-[400px] bg-purple-900/15 top-1/3 right-[-100px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-8">
            {services.map(({ icon, title, tagline, desc, features }) => (
              <div key={title} className="bg-brand-card border-glow rounded-2xl p-8 md:p-10 card-hover">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-purple-900/40 border border-purple-800/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                        {icon}
                      </div>
                      <div>
                        <div className="text-purple-400 text-xs font-semibold uppercase tracking-widest font-display">{tagline}</div>
                        <h2 className="font-display font-bold text-white text-2xl">{title}</h2>
                      </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4 font-display">What's Included</div>
                    <ul className="space-y-2">
                      {features.map(f => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                          <svg className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-card/40 border-t border-brand-border relative overflow-hidden">
        <div className="glow-blob w-[500px] h-[300px] bg-purple-900/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-4xl text-white mb-4">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Let's talk. A free 30-minute strategy call will help us understand your goals and recommend the right approach.
          </p>
          <Link to="/contact" className="btn-primary text-base">Book a Free Strategy Call</Link>
        </div>
      </section>
    </>
  )
}
