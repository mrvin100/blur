This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



## Authentication flow step and how to it works with the REST APIs

Authentication Flow:
a. Initial Load:
When the application starts, the AuthProvider component is initialized
It automatically runs checkAuth() on mount to verify if there's an existing session
This checks /api/auth/session endpoint to validate the current session
b. Login Process:
User enters credentials on the login page
The login() function is called with username and password
It sends a POST request to /api/auth/login
On successful login:
User data is stored in the context
isAuthenticated is set to true
User is redirected based on their role (admin or user dashboard)
c. Session Management:
The DashboardLayout component uses useAuth() hook to protect routes
If not authenticated, it redirects to the login page
Different content is shown based on user role (admin vs user)
d. Logout Process:
User triggers logout
Calls /api/auth/logout endpoint
Clears user data from context
Redirects to login page