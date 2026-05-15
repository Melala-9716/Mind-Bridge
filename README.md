
🧠 Mind Bridge

A mental wellness platform bridging the gap between individuals seeking psychological support and professionals ready to help.

🚀 Badges

Next.js React TypeScript TailwindCSS

ABOUT THE PROJECT
Mental health challenges are often invisible but deeply impactful. Many individuals struggle silently due to limited access to professionals, communication barriers, or uncertainty about where to start.

Mind Bridge solves this by creating a simple and structured platform that connects users with licensed mental health professionals such as psychologists and psychiatrists.

It allows users to move from confusion to clarity by providing a direct, organized way to seek support.

KEY FEATURES 👤 Users Browse verified mental health professionals View detailed profiles (bio, specialization, languages) Check weekly availability Send consultation requests Track request status: ⏳ Pending ✅ Accepted ❌ Declined 🩺 Professionals Secure authentication (login/register) Editable professional profile Manage consultation requests Accept or decline requests Set weekly availability schedule

⚡ PLATFORM EXPERIENCE Clean, modern UI Fully responsive design Fast navigation Simple and intuitive workflow Screenshots

(Replace placeholders with real screenshots later for a stronger portfolio impact)

Home Page

Professionals Page

Profile Page

Dashboard

Consultation System

⚙️ Tech Stack Frontend Next.js React TypeScript Tailwind CSS Backend Supabase (Authentication + APIs) Database PostgreSQL

🧠 System Flow User registers or logs in User browses professionals User views a professional profile User sends a consultation request Professional receives request Professional accepts or declines User sees updated request status

🚀 Getting Started

Clone the repository git clone https://github.com/Melala-9716/mind-bridge.git cd mind-bridge
Install dependencies npm install
Run development server npm run dev 🔐 Environment Variables
Create a .env.local file in the root directory:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

**Future Improvements Real-time chat system Video consultations AI mental health assistant Verified professionals system Mobile application Notification system Team

A full-stack project built to improve accessibility to mental health support through technology.

📄 License

This project is for educational and demonstration purposes only.

❤️ Final Message

“Mind Bridge exists to make mental health support more accessible, structured, and human.”



This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_3MfalBMNwKFGQcN2tCcfswBaUkVE)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Supabase setup (required — fixes “Supabase is not configured” / 503 on register)

If registration shows **503** or **“Supabase is not configured…”**, the server does not see valid env vars. Do this once per machine:

### 1. Create `.env.local`

In the **project root** (next to `package.json`), create **`.env.local`**. Copy **`.env.example`** and fill all three variables, or replace the placeholders in the generated `.env.local`.

### 2. Get real values from Supabase

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and open your project (create one if needed).
2. Go to **Project Settings** (gear) → **API**.
3. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` (e.g. `https://xxxxx.supabase.co`).
4. **Project API keys** → **`anon` `public`** → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (used by `lib/supabase.ts` in the browser; safe to expose with Row Level Security).
5. **`service_role` `secret`** → `SUPABASE_SERVICE_ROLE_KEY` (server / API routes only via `lib/supabase-server.ts` — never use in client code or commit to git).

Example shape (use **your** values):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Create the `professionals` table

In Supabase: **SQL Editor** → New query → paste and run everything in **`supabase/schema.sql`**.

### 4. Restart Next.js

Env files are read when the dev server starts:

```bash
npm run dev
```

After that, professional registration, login, and the professionals listing use the database.

**Note:** `.env.local` is listed in `.gitignore` and must not be committed.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/Melala-9716/v0-mind
