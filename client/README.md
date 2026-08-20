# Vesper client

Vesper is a Next.js legal-assistance workspace for explaining legal questions and PDFs, booking consultations, and managing appointments for individuals and lawyers.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to the API origin.
3. Start the API (the local default is `http://localhost:8787`).
4. Start the client with `npm run dev` and open `http://localhost:3000`.

```env
NEXT_PUBLIC_API_URL=http://localhost:8787
```

If the environment variable is omitted, the client uses `http://localhost:8787` for local development.

## Available flows

- Individual and lawyer registration/login
- Role-protected dashboards
- Legal AI chat and PDF summarization
- Lawyer discovery and consultation booking
- User appointment search, filtering, contact, and cancellation
- Lawyer schedule search, filtering, client contact, and appointment details

## Commands

```bash
npm run dev
npm run build
npm run start
```

The production build includes TypeScript validation and static route generation.
