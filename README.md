# 📝 Blog App — Next.js + Convex + Better Auth

A full-stack blogging platform built with **Next.js 16 (App Router)**, **Convex** as the real-time backend/database, **Better Auth** for authentication, and **Shadcn/UI** for the component layer. Users can sign up, write posts with images, search posts, comment, and see who else is viewing a post in real time.

## ✨ Features

- 🔐 **Authentication** — Email/password sign-up & sign-in via `better-auth`, integrated with Convex through `@convex-dev/better-auth`
- 🛡️ **Protected routes** — Middleware (`proxy.ts`) guards `/blogs` and `/create`, redirecting unauthenticated users to sign-in
- 📰 **Blog posts** — Create, list, and view posts with image uploads (stored in Convex file storage)
- 🔍 **Full-text search** — Search posts by title or content using Convex search indexes
- 💬 **Comments** — Real-time commenting on each post
- 🟢 **Live presence** — See which users are currently viewing a post via `@convex-dev/presence`
- 🎨 **Modern UI** — Built with Shadcn/UI, Radix primitives, Tailwind CSS, and `next-themes` for dark mode
- ✅ **Type-safe forms** — `react-hook-form` + `zod` validation for sign-up, sign-in, and post creation

## 🧱 Tech Stack

| Layer          | Technology                                   |
| -------------- | --------------------------------------------- |
| Framework      | Next.js 16 (App Router), React 19, TypeScript |
| Backend / DB   | Convex (real-time database & serverless functions) |
| Auth           | Better Auth (`@convex-dev/better-auth`)       |
| UI             | Shadcn/UI, Radix UI, Tailwind CSS             |
| Forms          | React Hook Form + Zod                         |
| Realtime       | Convex Presence (`@convex-dev/presence`)      |
| Notifications  | Sonner (toasts)                               |

## 📁 Project Structure

```
my-app/
├── app/
│   ├── (shared-layout)/
│   │   ├── blogs/            # Blog listing & single post pages
│   │   ├── create/           # Create post page
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/[...all]/    # Better Auth route handler
│   │   └── blogs/getBlogs/   # Blog API route
│   ├── auth/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── schema/                # Zod schemas (auth, blog, comments)
│   └── actions.ts             # Server actions
├── components/
│   ├── ui/                    # Shadcn/UI primitives
│   └── web/                   # App-specific components (Navbar, Comments, Presence, Search, etc.)
├── convex/
│   ├── schema.ts               # Database schema (posts, comments)
│   ├── posts.ts                 # Post queries/mutations + search
│   ├── comments.ts              # Comment queries/mutations
│   ├── auth.ts / auth.config.ts # Better Auth + Convex integration
│   └── presence.ts              # Live presence backend logic
├── lib/
│   ├── auth-client.ts
│   ├── auth-server.ts
│   └── utils.ts
└── proxy.ts                    # Auth middleware (protected routes)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) (project uses a `pnpm-workspace.yaml`)
- A [Convex](https://convex.dev) account/project

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up Convex

```bash
npx convex dev
```

This will prompt you to log in and create/select a Convex deployment, and will generate the `convex/_generated` folder.

### 3. Configure environment variables

Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_CONVEX_URL=          # from `npx convex dev`
NEXT_PUBLIC_CONVEX_SITE_URL=      # your Convex deployment's site URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
SITE_URL=http://localhost:3000
TRUSTED_ORIGIN=http://localhost:3000
```

> These power the Convex client connection and Better Auth's trusted origins / base URL configuration.

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🗄️ Data Model

**`posts`**
- `title: string`
- `content: string`
- `authorId: string`
- `imageStorageId?: Id<"_storage">`
- Search indexes on `title` and `content`

**`comments`**
- `postId: Id<"posts">`
- `authorId: string`
- `authorName: string`
- `content: string`

## 🔐 Authentication Flow

- Sign-up / sign-in forms are validated with Zod schemas (`app/schema/auth.ts`) and submitted via `better-auth`'s client.
- `proxy.ts` checks for a valid session cookie on every request to `/blogs` and `/create`, redirecting to `/auth/sign-in` if missing.
- Convex functions (e.g. `createPost`, `createComment`) verify the authenticated user server-side via `authComponent.safeGetAuthUser(ctx)` before allowing writes.

## 📦 Available Scripts

| Command        | Description                  |
| --------------- | ----------------------------- |
| `pnpm dev`      | Start the Next.js dev server  |
| `pnpm build`    | Build for production          |
| `pnpm start`    | Start the production server   |
| `pnpm lint`     | Run ESLint                    |

## 🛣️ Roadmap / Ideas

- [ ] Likes/reactions on posts
- [ ] User profile pages
- [ ] Edit/delete posts
- [ ] Pagination/infinite scroll on the blog feed
- [ ] Re-enable the search dropdown UI (currently commented out in `SearchInput.tsx`)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js and Convex.
