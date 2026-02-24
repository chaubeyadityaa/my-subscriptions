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

---

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:chaubeyadityaa/my-subscriptions.git
cd my-subscriptions