
# MySubscriptions

A connected services dashboard that allows users to view their online service data with AI-powered summaries and insights. Built with **Next.js**, **TypeScript**, **TailwindCSS**, and **OpenAI/HuggingFace** for summarization.

---

## Features

- **OAuth2 Authentication**  
  Sign in with GitHub to access your repositories. Easily extendable to other services (Spotify, Google Calendar, Reddit, etc.).

- **Fetch & Display Items**  
  Retrieves your repositories and displays metadata:
  - Repository name (with link)  
  - Owner name and avatar  
  - Created & updated dates  
  - Description

- **AI-Powered Insights**  
  - Summarization of repository descriptions  
  - Keyword extraction for quick insights  

- **Dashboard UI**  
  - Responsive grid layout  
  - Cards with hover effects  
  - Handles loading, error, and empty states  

---

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS  
- **Backend / API**: Next.js API routes  
- **AI/NLP**: OpenAI API (or HuggingFace) for summarization, custom keyword extraction  
- **Authentication**: NextAuth.js with OAuth2  
- **Testing**: Jest, React Testing Library, Axios mocks  
- **CI/CD**: GitHub Actions (tests on PR & push)  
- **Deployment**: Vercel  
  🔗 https://my-subscriptions-vylf.vercel.app/

---

## Project Structure

```
my-subscriptions/
│
├── .github/
│   └── workflows/
│       └── test.yml              # GitHub Actions CI workflow
│
├── docs/                         # Documentation
├── node_modules/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── __tests__/                # Unit/integration tests
│   │   └── ...test.ts
│   │
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── route.test.ts
│   │   │   │   ├── authOptions.ts
│   │   │   │   └── route.test.ts
│   │   │   │
│   │   │   ├── github-repos/
│   │   │   │   ├── route.ts
│   │   │   │   └── route.test.ts
│   │   │   │
│   │   │   └── summarize/
│   │   │       ├── route.ts
│   │   │       └── route.test.ts
│   │   │
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Main dashboard page
│   │
│   ├── components/               # React components
│   │   └── ...tsx
│   │
│   ├── lib/                      # Helpers & utilities
│   │   └── ...
│   │
│   └── types/                    # TypeScript definitions
│       └── next-auth.d.ts
│
├── .env.local                    # Environment variables
├── .gitignore
│
├── eslint.config.mjs             # ESLint config
├── jest.config.js                # Jest config
├── jest.setup.js                 # Jest test bootstrap
│
├── next.config.ts                # Next.js config
├── next-env.d.ts                 # Next.js TS environment definitions
│
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
│
└── README.md
```

---

## Getting Started

### 1. Clone the repository
```bash
git clone git@github.com:chaubeyadityaa/my-subscriptions.git
cd my-subscriptions
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

---

## Environment Variables

Create a `.env.local` file:

```env
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

OPENAI_API_KEY=your_openai_key
HUGGINGFACE_API_KEY=your_huggingface_key
```

Generate secret:
```bash
openssl rand -base64 32
```

---

## Running the Application

### Development
```bash
npm run dev
```
http://localhost:3000

### Production
```bash
npm run build
npm start
```

---

## Testing
```bash
npm test
npm run test:coverage
```

---

## Roadmap

- [ ] Add more integrations (Google Calendar, Spotify, Reddit)  
- [ ] Customizable dashboards  
- [ ] Vector embeddings for repositories  
- [ ] Monthly email report  
- [ ] Optional React Native mobile app  

---

## Contributing

1. Fork the repo  
2. Create a feature branch  
3. Submit a PR  

---

## License

MIT License © 2026 Adityaa Chaubey

