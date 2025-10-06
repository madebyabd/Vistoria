# Vistoria AI Studio

Vistoria is an AI-powered image transformation studio that helps designers, product teams, and hobbyists reimagine visuals in minutes. The platform combines a credit-based workflow, granular transformation controls, and collaborative tooling to streamline how your team experiments with AI-assisted edits.

![Vistoria dashboard preview](./public/assets/images/readme-cover.png)

---

## Table of Contents

1. [Overview](#overview)
2. [Feature Highlights](#feature-highlights)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Available Scripts](#available-scripts)
8. [Project Structure](#project-structure)
9. [Cloud Integrations](#cloud-integrations)
10. [Testing Checklist](#testing-checklist)
11. [Roadmap](#roadmap)
12. [Team & License](#team--license)

---

## Overview

Vistoria empowers users to apply professional-grade edits — restoration, background removal, generative fill, object recoloring, and more — without leaving the browser. The platform wraps the best AI tooling and media infrastructure inside a polished dashboard with real-time previews, auditability, and secure billing.

Key design goals:

- **Create once, iterate fast:** Every transformation persists with metadata so you can refine or repurpose results.
- **Transparent usage:** Credits and Stripe-powered billing make usage predictable for both individuals and teams.
- **Secure & compliant:** Authentication via Clerk and data persistence in MongoDB keep accounts isolated and auditable.

---

## Feature Highlights

- **Adaptive Transformations:** Restoration, background removal, generative fill, object removal, and recoloring powered by Cloudinary.
- **Prompt-aware Editing:** Fine-tune transformations with prompts, aspect ratios, and color targets.
- **Media Library:** Paginated galleries, search, and detail pages for every edit.
- **Usage Controls:** Credit ledger, purchase flows, and insufficient-credit fail-safes.
- **Collaboration Ready:** Clerk-managed identities with profile views and role-ready metadata.
- **Responsive UI:** Tailored layouts for desktop and mobile, including sidebar navigation and quick actions.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router) + React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom tokens and shadcn/ui components
- **Auth:** Clerk
- **Database:** MongoDB via Mongoose
- **Media Processing:** Cloudinary
- **Billing:** Stripe Checkout & Webhooks
- **State & Forms:** React Hook Form + Zod

---

## System Architecture

```
Browser (Next.js App Router)
│
├─ Clerk Frontend SDK (Auth)
├─ Stripe Checkout (Payments)
│
└─ Next.js Route Handlers
   ├─ Webhooks (Clerk, Stripe)
   ├─ Image Actions (CRUD, Cloudinary integration)
   └─ Transaction Actions (credits, billing)

MongoDB (User, Image, Transaction models)
Cloudinary (asset storage & transformations)
Stripe (payments & subscriptions)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas or a standalone MongoDB instance
- Accounts for Clerk, Cloudinary, and Stripe

### Installation

```bash
# Clone and install
git clone https://github.com/your-org/vistoria.git
cd vistoria
npm install
```

### Run Locally

1. Configure the environment variables in `.env.local` (see below).
2. Start the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000` in your browser.

### Build & Start

```bash
npm run build
npm run start
```

---

## Environment Variables

Create a `.env.local` in the project root with the following keys:

```env
# App
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# MongoDB
MONGODB_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

> **Tip:** Use Clerk test users and Stripe test keys while developing. Replace them with production values prior to deploying.

---

## Available Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start Next.js in development mode    |
| `npm run build` | Create an optimized production build |
| `npm run start` | Run the production server            |
| `npm run lint`  | Lint the project with ESLint         |

---

## Project Structure

```
app/
  ├─ api/            # Route handlers (webhooks, REST-like actions)
  ├─ (auth)/         # Auth routes powered by Clerk
  ├─ credits/        # Credits purchase flow
  ├─ profile/        # User dashboard and galleries
  └─ transformations/# Transformation forms and detail pages
components/
  ├─ shared/         # Reusable UI + feature components
  └─ ui/             # shadcn/ui primitives
lib/
  ├─ actions/        # Server actions for database + services
  ├─ database/       # Mongoose models & connectors
  └─ utils/          # Helpers (queries, formatting, etc.)
public/
  └─ assets/         # Logos, icons, and marketing visuals
```

---

## Cloud Integrations

- **Clerk:** Configure the allowed callback URLs, add your public and secret keys, and enable the webhooks that hit `/api/webhooks/clerk`.
- **Cloudinary:** Create a folder (e.g. `vistoria`) and grant authenticated access. Update `lib/actions/image.actions.ts` if you change naming conventions.
- **Stripe:** Create products/prices for your plans. Point the webhook endpoint to `/api/webhooks/stripe` and enable the `checkout.session.completed` event.

---

## Testing Checklist

- [ ] Sign up, sign in, and update profile details
- [ ] Create each transformation type and verify Cloudinary assets
- [ ] Attempt transformation with insufficient credits (modal + redirect)
- [ ] Purchase credits in Stripe test mode and confirm balance updates
- [ ] Validate webhook retries by replaying events from Stripe & Clerk dashboards
- [ ] Run `npm run lint` and resolve any outstanding warnings/errors

---

## Roadmap

- Bulk uploads with batch transformations
- Fine-grained role management and team workspaces
- Custom trained models for on-brand image generation
- Activity insights with credit forecasting
- Native desktop dropzone for large assets

---

## Team & License

Vistoria is maintained by the Vistoria Labs team. Reach us at `hello@vistoria.app` for collaboration ideas, partnership requests, or enterprise pilots.

This repository is released under the MIT License. See `LICENSE` for details.
