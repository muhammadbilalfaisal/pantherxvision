# Panther X Vision Website

The public marketing website for Panther X Vision, a growth-driven digital marketing agency based in Karachi, Pakistan. It presents the agency's services, story, process, and contact funnel in a responsive single-page React application.

## Features

- Responsive landing, about, services, contact, and 404 pages
- Accessible navigation and labelled contact form
- Formspree-powered contact submissions
- Route-specific titles, descriptions, and canonical metadata
- Reduced-motion support
- Netlify SPA routing and deployment configuration
- Automated lint, test, and production-build checks

## Tech stack

- React 18
- React Router 6
- Vite 8
- Tailwind CSS 3
- Vitest and React Testing Library
- Netlify

## Requirements

- Node.js 20.19 or newer (Node.js 22.12+ is also supported)
- npm 9 or newer

## Local development

```bash
git clone <your-repository-url>
cd pantherxvision
npm ci
copy .env.example .env.local
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). On macOS or Linux, use `cp .env.example .env.local` instead of `copy`.

## Environment variables

Create `.env.local` from `.env.example` and configure:

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_FORMSPREE_ENDPOINT` | Yes for form submissions | Full Formspree endpoint, such as `https://formspree.io/f/xabcdefg` |

Vite exposes `VITE_` variables to browser code. Do not place secrets in them. A Formspree form endpoint is a public client-side identifier, not an API secret.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create the production build in `dist/` |
| `npm run generate:sitemap` | Generate `public/sitemap.xml` from the public route configuration |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the source and tests |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run check` | Run lint, tests, and a production build |

## Project structure

```text
public/                 Static brand assets
src/
  components/           Shared navigation, footer, and headings
  pages/                Route-level page components
  config/seo.js         Public routes and route-specific SEO metadata
  App.jsx               Routing and page metadata
  index.css             Tailwind layers and global styles
netlify.toml            Netlify build and SPA fallback rules
scripts/                 Build-time sitemap generation
```

## Contact form setup

1. Create a form at [Formspree](https://formspree.io/).
2. Copy its full endpoint URL.
3. Set `VITE_FORMSPREE_ENDPOINT` in `.env.local` for development.
4. Add the same variable in the Netlify site's environment settings for production.

If the variable is absent or Formspree rejects a request, the form displays an error and directs the visitor to email the agency.

## Deployment

The repository includes [netlify.toml](./netlify.toml), which configures `npm run build`, publishes `dist`, and redirects client-side routes to `index.html`.

To deploy through GitHub:

1. Push the repository to GitHub.
2. Import it into [Netlify](https://www.netlify.com/).
3. Configure the Formspree environment variable above.
4. Deploy. Netlify will use the committed build configuration automatically.

Before publishing, replace this paragraph with the live site URL and add a project screenshot or social-sharing image.

## Customization

- Contact details and social links: `src/components/Footer.jsx` and `src/pages/Contact.jsx`
- Team profiles: the `team` array in `src/pages/About.jsx`
- Brand colors and fonts: `tailwind.config.js`
- Logo and favicons: `public/logo.png`, `public/favicon.ico`, and the PNG icon variants in `public/`
- Routes and SEO metadata: `src/config/seo.js` (the sitemap is generated from this list)

## Troubleshooting

- **Direct route returns 404 on another host:** configure that host to serve `index.html` for unknown paths. Netlify is already configured.
- **Contact form always errors:** confirm `VITE_FORMSPREE_ENDPOINT` is set before starting or building the app.
- **Environment change is not visible:** restart the development server; Vite reads environment variables at startup.

## License

All rights reserved. This repository's source code and brand assets are proprietary to Panther X Vision unless a separate license is added.
