# MySubscriptions

MySubscriptions is a connected-services dashboard focused on GitHub repositories. Users sign in with GitHub, view recent repositories, and get AI-generated summaries plus keyword insights.

## Features

- GitHub OAuth login via NextAuth
- Repository cards with metadata, links, and owner avatars
- AI summaries (Hugging Face) and keyword extraction
- Search and sorting in dashboard UI
- Loading skeletons, retry handling, and empty/error states

## Recent Improvements

- Reduced OAuth scope to `read:user public_repo`
- Kept provider access token server-side only (not exposed on session)
- Added request/response validation and stronger API error mapping
- Added batched `GET /api/repo-insights` endpoint
- Added in-memory TTL caching for repos and summaries
- Added summary fallback signaling in UI
- Expanded tests for auth, repo APIs, summarize API, and dashboard behavior

## Tech Stack

- Next.js (App Router), React, TypeScript
- TailwindCSS
- NextAuth.js
- Hugging Face Inference API
- Jest + React Testing Library

## Deployment

- Vercel: https://my-subscriptions-vylf.vercel.app/

## CI

- GitHub Actions runs the test suite on every push.

## Project Structure

```text
my-subscriptions/
├── docs/
│   └── feature-spec.md
├── public/
│   └── *.svg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── route.test.ts
│   │   │   │   └── authOptions.ts
│   │   │   ├── github-repos/
│   │   │   │   ├── route.ts
│   │   │   │   └── route.test.ts
│   │   │   ├── repo-insights/
│   │   │   │   ├── route.ts
│   │   │   │   └── route.test.ts
│   │   │   └── summarize/
│   │   │       ├── route.ts
│   │   │       └── route.test.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── HomeClient.tsx
│   │   ├── HomeClient.test.tsx
│   │   ├── Providers.tsx
│   │   ├── ReposDashboard.tsx
│   │   └── ReposDashboard.test.tsx
│   ├── lib/
│   │   ├── auth-token.ts
│   │   ├── cache.ts
│   │   ├── keywords.ts
│   │   ├── keywords.test.ts
│   │   ├── repos.ts
│   │   └── summarize.ts
│   └── types/
│       └── next-auth.d.ts
├── .env.example
├── eslint.config.mjs
├── jest.config.js
├── jest.setup.js
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create local env file:

```bash
cp .env.example .env.local
```

3. Fill values in `.env.local`:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `HUGGINGFACE_API_KEY`

4. Run development server:

```bash
npm run dev
```

## Scripts

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run start` - start production server
- `npm run lint` - run ESLint
- `npm test` - run Jest test suite

## API Endpoints

- `GET /api/github-repos`: fetch authenticated user repos
- `POST /api/summarize`: summarize text payload (`{ text: string }`)
- `GET /api/repo-insights`: batched repo metadata + summary + keywords
- OpenAPI spec: `docs/openapi.yaml`

## Notes

- AI responses can degrade gracefully when Hugging Face is unavailable.
- Cache is in-memory and instance-local (good for local/dev and single-instance deploys).
