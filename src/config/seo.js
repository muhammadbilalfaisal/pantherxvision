export const SITE_URL = 'https://pantherxvision.com'

export const publicPages = [
  {
    path: '/',
    title: 'Panther X Vision | Digital Marketing Agency in Karachi',
    description: 'Growth-driven digital marketing, SEO, paid advertising, branding, and web design for ambitious businesses in Karachi and beyond.',
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    path: '/about',
    title: 'About Us | Panther X Vision',
    description: 'Meet Panther X Vision, a Karachi digital marketing agency built around bold strategy, transparent reporting, and measurable growth.',
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    path: '/services',
    title: 'Digital Marketing Services | Panther X Vision',
    description: 'Explore social media marketing, SEO, PPC, content, brand strategy, and web design services from Panther X Vision.',
    changeFrequency: 'monthly',
    priority: 0.9,
  },
  {
    path: '/contact',
    title: 'Contact Panther X Vision | Book a Strategy Call',
    description: 'Contact Panther X Vision to book a free digital growth strategy call for your business.',
    changeFrequency: 'yearly',
    priority: 0.7,
  },
]

export const pageMetadata = Object.fromEntries(
  publicPages.map(({ path, title, description }) => [path, { title, description }]),
)
