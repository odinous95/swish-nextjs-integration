# Swish Next.js Integration

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). The project follows a **feature-sliced** architecture and integrates several modern tools and services:

- **Swish Payment API** for handling payments.
- **Drizzle ORM** for database interactions.
- **PostgreSQL** as the database.
- **Resend** for sending emails.
- **Zod** for schema validation.
- **Zustand** for state management.
- **Next.js Server Actions** with `useActionState` for handling server-side logic.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font).

## Features

- **Feature-Sliced Architecture:** Organize code by features for better scalability and maintainability.
- **Swish Payment Integration:** Accept payments using the Swish API.
- **Database Layer:** Use Drizzle ORM with PostgreSQL for robust data management.
- **Email Sending:** Send transactional emails via Resend.
- **Validation:** Ensure data integrity with Zod schemas.
- **State Management:** Manage client-side state efficiently with Zustand.
- **Server Actions:** Use Next.js server actions and `useActionState` for seamless server-side logic and state management.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Swish API Documentation](https://developer.swish.nu/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Resend](https://resend.com/)
- [Zod](https://zod.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
