# Blur - Racing Event Management Frontend

> Modern Next.js web application for managing racing events, parties, and competitive gameplay with real-time race tracking and comprehensive user management.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Table of Contents

- [Vision & Mission](#-vision--mission)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Branching Strategy](#-branching-strategy)
- [Contribution Workflow](#-contribution-workflow)
- [Pull Request Process](#-pull-request-process)
- [Code Standards](#-code-standards)
- [Community](#-community)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🎯 Vision & Mission

**Blur** is an open-source web application designed to streamline the management of racing events and competitive gameplay. Built with modern web technologies, it provides an intuitive interface for organizing parties, tracking races, managing participants, and analyzing performance metrics.

### Why Open Source?

- **Community-Driven**: Enable racing communities to customize and extend the platform
- **Transparency**: Open development process with clear contribution guidelines
- **Learning**: Provide a real-world Next.js application for developers to learn from
- **Collaboration**: Build a better racing management tool together

We welcome contributions from developers of all skill levels!

---

## ✨ Features

### Core Functionality
- 🏁 **Party Management**: Create and manage racing parties with multiple participants
- 🏎️ **Race Tracking**: Real-time race status monitoring and result recording
- 👥 **User Management**: Comprehensive user profiles and role-based access control
- 📊 **Score System**: Track individual and team performance across races
- 🗺️ **Map Integration**: Visual race map selection and management
- 🚗 **Car Attribution**: Assign and manage vehicle selections for racers

### Technical Features
- ⚡ **Server-Side Rendering**: Fast initial page loads with Next.js App Router
- 🔐 **Secure Authentication**: JWT-based auth with Better Auth integration
- 🎨 **Modern UI**: Beautiful, responsive design with Radix UI and Tailwind CSS
- 🌙 **Dark Mode**: Full dark/light theme support
- 📱 **Mobile-First**: Responsive design optimized for all devices
- 🔄 **Real-time Updates**: Optimistic UI updates with TanStack Query
- ♿ **Accessibility**: WCAG compliant with keyboard navigation support

---

## 🛠️ Tech Stack

### Core Framework
- **[Next.js 16.0](https://nextjs.org/)** - React framework with App Router
- **[React 19.0](https://reactjs.org/)** - UI library with latest features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript

### State Management & Data Fetching
- **[TanStack Query 5.62](https://tanstack.com/query)** - Server state management
- **[Zustand 5.0](https://zustand-demo.pmnd.rs/)** - Lightweight client state
- **[React Hook Form 7.71](https://react-hook-form.com/)** - Form handling
- **[Zod 4.3](https://zod.dev/)** - Schema validation

### Authentication & Security
- **[Better Auth 1.2](https://www.better-auth.com/)** - Modern auth library
- **JWT Sessions** - Stateless authentication
- **Middleware Protection** - Route-level access control

### UI & Styling
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first CSS
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Developer Experience
- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - CSS vendor prefixing

---

## 📂 Project Structure

```
blur/
├── app/                          # Next.js App Router pages
│   ├── (app)/                    # Public application routes
│   │   ├── layout.tsx            # App layout wrapper
│   │   └── page.tsx              # Home page
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/              # Sign-in page
│   │   └── sign-up/              # Registration page
│   ├── (board)/                  # Protected dashboard routes
│   │   └── dashboard/            # Main dashboard
│   │       ├── history/          # Race history
│   │       ├── party/            # Party management
│   │       ├── permissions/      # Role & permissions
│   │       ├── profile/          # User profile
│   │       ├── settings/         # Application settings
│   │       └── users/            # User management
│   ├── api/                      # API routes
│   │   ├── auth/[...all]/        # Better Auth handler
│   │   └── session/              # Session management
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── not-found.tsx             # 404 page
│
├── components/                   # Reusable components
│   ├── ui/                       # UI primitives (Radix + custom)
│   ├── shared/                   # Shared components (Header, Footer)
│   ├── app-sidebar.tsx           # Application sidebar
│   └── submit-button.tsx         # Form submit button
│
├── modules/                      # Feature modules
│   ├── auth/                     # Authentication features
│   │   ├── context/              # Auth context provider
│   │   ├── sign-in/              # Sign-in components
│   │   └── sign-up/              # Sign-up components
│   ├── home/                     # Home page features
│   ├── party/                    # Party management features
│   ├── history/                  # Race history features
│   └── users/                    # User management features
│
├── lib/                          # Core utilities
│   ├── schemas/                  # Zod validation schemas
│   ├── stores/                   # Zustand stores
│   ├── api-client.ts             # API client (ky wrapper)
│   ├── api-error-handler.ts      # Error handling utilities
│   ├── auth-client.ts            # Client-side auth utilities
│   ├── auth.ts                   # Better Auth configuration
│   ├── backend.ts                # Backend URL helpers
│   ├── permissions.ts            # Permission checking logic
│   ├── query-keys.ts             # TanStack Query keys
│   └── utils.ts                  # General utilities
│
├── hooks/                        # Custom React hooks
│   ├── useCars.hook.ts           # Car data management
│   ├── useMaps.hook.ts           # Map data management
│   ├── useParties.hook.ts        # Party data management
│   ├── useRaces.hook.ts          # Race data management
│   ├── useRoles.hook.ts          # Role data management
│   ├── useScores.hook.ts         # Score data management
│   └── useUsers.hook.ts          # User data management
│
├── services/                     # API service layer
│   ├── car.service.ts            # Car API calls
│   ├── map.service.ts            # Map API calls
│   ├── party.service.ts          # Party API calls
│   ├── race.service.ts           # Race API calls
│   ├── role.service.ts           # Role API calls
│   ├── score.service.ts          # Score API calls
│   └── user.service.ts           # User API calls
│
├── types/                        # TypeScript type definitions
│   ├── api.types.ts              # API response types
│   ├── auth.types.ts             # Authentication types
│   ├── car.types.ts              # Car entity types
│   ├── party.types.ts            # Party entity types
│   ├── race-count.types.ts       # Race count types
│   └── user.types.ts             # User entity types
│
├── config/                       # Configuration files
│   └── api.ts                    # API endpoint configuration
│
├── provider/                     # React providers
│   └── app.providers.tsx         # Combined app providers
│
├── public/                       # Static assets
│   ├── file.svg                  # Static SVG icons
│   └── ...
│
├── middleware.ts                 # Next.js middleware (auth protection)
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── components.json               # shadcn/ui configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

### Architecture Highlights

- **App Router**: Uses Next.js 13+ App Router with grouped routes
- **Route Groups**: `(app)`, `(auth)`, `(board)` organize routes without affecting URLs
- **Modular Design**: Features organized in `modules/` for better scalability
- **Service Layer**: Clean separation between API calls and UI logic
- **Type Safety**: Comprehensive TypeScript types and Zod schemas
- **Custom Hooks**: Reusable data fetching with TanStack Query

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: v18.17 or higher ([Download](https://nodejs.org/))
- **npm**: v9+ or **pnpm**: v8+ (recommended)
- **Git**: For version control

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/your-org/blur.git
cd blur
```

#### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using pnpm (recommended):
```bash
pnpm install
```

#### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from example (if available)
cp .env.example .env.local

# Or create manually
touch .env.local
```

See [Environment Variables](#-environment-variables) section for details.

#### 4. Configure Backend Connection

Ensure your backend API is running (see `burApp/README.md`), then set:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

#### 5. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

The application will be available at **http://localhost:3000**

#### 6. Access the Application

- **Home**: http://localhost:3000
- **Sign In**: http://localhost:3000/sign-in
- **Dashboard**: http://localhost:3000/dashboard (requires authentication)

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8080` | ✅ |
| `NEXT_PUBLIC_API_VERSION` | API version prefix | `v1` | ❌ |
| `NEXT_PUBLIC_API_BASE_URL` | Frontend base URL for auth | `http://localhost:3000` | ❌ |
| `NEXT_PUBLIC_AUTH_API_LOGIN` | Login endpoint path | `/v1/auth/login` | ❌ |
| `NEXT_PUBLIC_AUTH_API_LOGOUT` | Logout endpoint path | `/v1/auth/logout` | ❌ |
| `NEXT_PUBLIC_AUTH_API_SESSION` | Session endpoint path | `/v1/auth/session` | ❌ |
| `BETTER_AUTH_URL` | Better Auth base URL | `http://localhost:3000` | ✅ |
| `BETTER_AUTH_SECRET` | Better Auth secret key | - | ✅ |

### Example `.env.local`

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_VERSION=v1

# Frontend Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Authentication Endpoints
NEXT_PUBLIC_AUTH_API_LOGIN=/v1/auth/login
NEXT_PUBLIC_AUTH_API_LOGOUT=/v1/auth/logout
NEXT_PUBLIC_AUTH_API_SESSION=/v1/auth/session

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-super-secret-key-change-this-in-production
```

### Generating Better Auth Secret

```bash
# Generate a secure random secret
openssl rand -base64 32
```

---

## ▶️ Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
# or
pnpm dev
```

Access at: **http://localhost:3000**

### Production Build

Build the optimized production bundle:

```bash
npm run build
npm run start
# or
pnpm build
pnpm start
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
# or
pnpm lint
```

### Type Checking

TypeScript type checking is automatic during development and build. To check manually:

```bash
npx tsc --noEmit
```

---

## 🌿 Branching Strategy

We follow a **Git Flow** inspired branching model for organized collaboration.

### Branch Types

| Branch | Purpose | Base | Merge Into | Naming |
|--------|---------|------|------------|--------|
| `main` | Production-ready code | - | - | `main` |
| `develop` | Integration branch | `main` | `main` | `develop` |
| `feature/*` | New features | `develop` | `develop` | `feature/party-creation` |
| `fix/*` | Bug fixes | `develop` | `develop` | `fix/auth-redirect` |
| `hotfix/*` | Urgent production fixes | `main` | `main` & `develop` | `hotfix/security-patch` |
| `release/*` | Release preparation | `develop` | `main` & `develop` | `release/v1.2.0` |

### Workflow Explanation

#### 1. **main** - Production Branch
- Contains stable, production-ready code
- Only updated through `release/*` or `hotfix/*` merges
- **Never commit directly to main**

#### 2. **develop** - Integration Branch
- Main development branch
- Always contains the latest completed features
- Base branch for all feature and fix branches
- **Never commit directly to develop** (use PRs)

#### 3. **feature/*** - Feature Branches
- Used for developing new features
- Branch from: `develop`
- Merge into: `develop`
- Example: `feature/race-leaderboard`, `feature/user-profile-edit`

```bash
# Create a feature branch
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature
```

#### 4. **fix/*** - Bug Fix Branches
- Used for fixing bugs found in development
- Branch from: `develop`
- Merge into: `develop`
- Example: `fix/login-validation`, `fix/race-timer`

```bash
# Create a fix branch
git checkout develop
git pull origin develop
git checkout -b fix/issue-description
```

#### 5. **hotfix/*** - Hotfix Branches
- Used for urgent production fixes
- Branch from: `main`
- Merge into: `main` AND `develop`
- Example: `hotfix/critical-security-fix`

```bash
# Create a hotfix branch
git checkout main
git pull origin main
git checkout -b hotfix/urgent-fix
```

#### 6. **release/*** - Release Branches
- Used for preparing a new production release
- Branch from: `develop`
- Merge into: `main` AND `develop`
- Example: `release/v1.2.0`

```bash
# Create a release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0
```

---

## 🤝 Contribution Workflow

We welcome contributions! Follow these steps to contribute:

### Step 1: Check Issues

Browse [GitHub Issues](https://github.com/mrvin100/blur/issues) to find tasks:

- 🐛 **bug** - Something isn't working
- ✨ **enhancement** - New feature or improvement
- 💬 **discussion** - Discussion or question
- 🚀 **good first issue** - Good for newcomers

### Step 2: Fork the Repository

```bash
# Fork via GitHub UI, then clone your fork
git clone https://github.com/YOUR_USERNAME/blur.git
cd blur
git remote add upstream https://github.com/your-org/blur.git
```

### Step 3: Create a Branch

```bash
# Update develop
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/my-awesome-feature
```

### Step 4: Make Changes

- Write clean, readable code
- Follow [Code Standards](#-code-standards)
- Add comments where necessary
- Update types and schemas as needed

### Step 5: Test Your Changes

```bash
# Run development server
npm run dev

# Check for linting issues
npm run lint

# Build to ensure no errors
npm run build
```

### Step 6: Commit Your Changes

Use **conventional commit** format:

```bash
git add .
git commit -m "feat: add race leaderboard component"
```

Commit types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### Step 7: Push to Your Fork

```bash
git push origin feature/my-awesome-feature
```

### Step 8: Open a Pull Request

1. Go to your fork on GitHub
2. Click **"New Pull Request"**
3. Base: `develop` ← Compare: `feature/my-awesome-feature`
4. Fill out the PR template (see below)
5. Submit the PR

---

## 📋 Pull Request Process

### PR Requirements

✅ **Must Have:**
- Clear title describing the change
- Description of what changed and why
- Reference to related issue (`Closes #123`)
- Screenshots for UI changes
- No merge conflicts with base branch
- Passes linting (`npm run lint`)

❌ **Must Not:**
- Break existing functionality
- Include unrelated changes
- Have commented-out code (unless documented)
- Contain merge commits (rebase instead)

### PR Template

```markdown
## Description
Brief description of changes

## Related Issue
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] No new warnings generated
- [ ] Tested locally
```

### Review Process

1. **Automated Checks**: Linting must pass
2. **Code Review**: At least 1 maintainer review required
3. **Testing**: Reviewer tests changes locally
4. **Approval**: Maintainer approves PR
5. **Merge**: PR merged into `develop` (squash merge preferred)

### After Merge

```bash
# Update your local develop
git checkout develop
git pull upstream develop

# Delete merged branch
git branch -d feature/my-awesome-feature
```

---

## 📏 Code Standards

### TypeScript Guidelines

- Use **TypeScript** for all files
- Define types in `types/` directory
- Use **Zod schemas** for runtime validation
- Avoid `any` type (use `unknown` if needed)

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
}

// ❌ Bad
const user: any = getData();
```

### React Best Practices

- Use **functional components** with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use **React.memo** for expensive components

```tsx
// ✅ Good - Small, focused component
export function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>;
}

// ❌ Bad - Component doing too much
export function UserDashboard() {
  // 500 lines of code...
}
```

### File Organization

- **One component per file**
- **Export from index.ts** for modules
- Use **named exports** (not default exports)
- Co-locate related files

```
modules/party/
├── index.ts              # Re-exports
├── PartyDashboard.tsx
├── PartyForm.tsx
└── usePartyData.ts
```

### Naming Conventions

- **Components**: PascalCase (`UserCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`usePartyData.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`User`, `PartyResponse`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Styling

- Use **Tailwind CSS** utility classes
- Extract repeated patterns into components
- Use **CSS variables** for theming
- Follow mobile-first approach

```tsx
// ✅ Good - Tailwind utilities
<div className="flex items-center gap-4 p-6">

// ❌ Bad - Inline styles
<div style={{ display: 'flex', padding: '24px' }}>
```

### State Management

- Use **Zustand** for global client state
- Use **TanStack Query** for server state
- Keep state as local as possible
- Avoid prop drilling (use context if needed)

### Error Handling

- Use **try/catch** for async operations
- Show user-friendly error messages
- Log errors for debugging
- Use error boundaries for React errors

---

## 🌍 Community

### Join the Discussion

💬 **Telegram Community**: [https://t.me/+b7cUePP1Q8BlMTlk](https://t.me/+b7cUePP1Q8BlMTlk)

Join our Telegram group to:
- Ask questions
- Share ideas
- Discuss features
- Connect with other contributors

### Contact Maintainers

- **GitHub Issues**: For bugs and feature requests
- **Telegram**: For general questions and discussion
- **Email**: mailtoteam48@gmail.com

### Code of Conduct

We are committed to providing a welcoming and inclusive environment:

- Be respectful and constructive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **Port 3000 Already in Use**

```bash
# Kill process on port 3000 (Unix/Mac)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 npm run dev
```

#### 2. **Backend Connection Refused**

- Ensure backend is running on port 8080
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS configuration in backend

#### 3. **Authentication Not Working**

- Check `BETTER_AUTH_SECRET` is set
- Verify backend auth endpoints are accessible
- Clear cookies and local storage
- Check network tab for failed requests

#### 4. **Module Not Found Errors**

```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

#### 5. **TypeScript Errors**

```bash
# Restart TypeScript server in VSCode
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Or rebuild types
npm run build
```

#### 6. **Styling Not Applied**

- Check Tailwind config includes all content paths
- Restart dev server after config changes
- Verify `globals.css` is imported in root layout

### Getting Help

If you encounter issues:

1. Check existing [GitHub Issues](https://github.com/mrvin100/blur/issues)
2. Ask in [Telegram community](https://t.me/+b7cUePP1Q8BlMTlk)
3. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with ❤️ by the **48 Students** team and open-source contributors.

Special thanks to:
- Next.js team for the amazing framework
- Radix UI for accessible components
- TanStack for excellent data fetching
- All contributors and community members

---

**Ready to contribute? Start by exploring [good first issues](https://github.com/mrvin100/blur/labels/good%20first%20issue)!**
