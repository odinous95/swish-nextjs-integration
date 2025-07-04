# Swish Next.js Integration

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). The project follows a **feature-sliced** architecture and integrates several modern tools and services:

- **Swish Payment API** for handling payments.
- **Stripe Integration** for accepting card payments and Klarna.
- **Drizzle ORM** for database interactions.
- **PostgreSQL** as the database.
- **Resend** for sending emails.
- **Zod** for schema validation.
- **Zustand** for state management.
- **Next.js Server Actions** with `useActionState` for handling server-side logic.

## Quick Start

### 1. Clone the repository and install dependencies

```bash
git clone <your-repo-url>
cd swish-stripe-nextjs-integration
pnpm install
# or
yarn install
# or
npm install
# or
bun install
```

### 2. Set up environment variables

Create a `.env.local` file in the root directory and add the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
# Swish Merchant Test Certificates
SWISH_CERT_TEST=ssl/Swish_Merchant_TestCertificate_1234679304.pem
SWISH_KEY_TEST=ssl/Swish_Merchant_TestCertificate_1234679304.key
SWISH_CA_TEST=ssl/Swish_TLS_RootCA.pem
SWISH_CALLBACK_URL="https://yoururl/api/swish/webhook"

# Production certificates
SWISH_CA_BASE64=
SWISH_CERT_BASE64=
SWISH_KEY_BASE64=
SWISH_ENV=development

# Stripe keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_SECRET_WEBHOOK_KEY=

# Database
DATABASE_URL=

# Resend
RESEND_API_KEY=
```

### 3. Run the development server

```bash
pnpm dev
# or
yarn dev
# or
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

- **Feature-Sliced Architecture:** Organize code by features for better scalability and maintainability.
- **Swish Payment Integration:** Accept payments using the Swish API.
- **Stripe Integration:** Accept card payments and Klarna via Stripe.
- **Database Layer:** Use Drizzle ORM with PostgreSQL for robust data management.
- **Email Sending:** Send transactional emails via Resend.
- **Validation:** Ensure data integrity with Zod schemas.
- **State Management:** Manage client-side state efficiently with Zustand.
- **Server Actions:** Use Next.js server actions and `useActionState` for seamless server-side logic and state management.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Swish API Documentation](https://developer.swish.nu/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Resend](https://resend.com/)
- [Zod](https://zod.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Next.js GitHub repository](https://github.com/vercel/next.js)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
