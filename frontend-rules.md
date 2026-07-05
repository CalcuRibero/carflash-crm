# Frontend Rules

> Stack: **Next.js · React · TypeScript · Tailwind CSS**
> Architecture: **Feature-based**
> API: **External NestJS API**
> Constraints: No third-party packages without explicit team consent

---

## 1. Technology Constraints

### Forbidden
- **Any third-party npm package** that has not been approved by the team. Before adding a dependency, open a discussion and get explicit consent. This includes UI libraries, utility belts, animation libraries, date helpers, etc.

### Allowed without approval
- **Next.js** (already in the project) — use the App Router by default. Use the Pages Router only when migrating legacy code.
- **Tailwind CSS** (already in the project) — the primary styling tool. See §5 for usage rules.
- React and ReactDOM (already in the project)
- TypeScript (already in the project)
- The browser's native APIs (`fetch`, `localStorage`, `IntersectionObserver`, etc.)
- Node built-ins used at build time or in server-side code (`next.config.ts`)

### Next.js-specific guidance
- Prefer **Server Components** by default. Add `"use client"` only when you need browser APIs, event handlers, or React hooks.
- Use **Next.js file-based routing** (`app/` directory). Do not maintain a separate client-side router.
- Do **not** create Route Handlers (`app/api/`) to proxy or replicate what the NestJS API already provides. Next.js owns the UI; NestJS owns the API.
- Do **not** use **Server Actions** for data mutations — send mutations directly to the NestJS API instead.
- Use `next/image` for all `<img>` elements to get automatic optimisation and lazy loading.
- Use `next/link` for all internal navigation instead of plain `<a>` tags.
- Use `next/font` to load custom fonts; do not self-host font files manually.
- Environment variables follow Next.js conventions: prefix with `NEXT_PUBLIC_` for client-exposed values, keep secrets (e.g. `NESTJS_API_URL`, auth tokens) server-only.

### NestJS API integration
- The backend is an **external NestJS API**. The frontend never implements business logic that belongs there.
- Store the NestJS base URL in an environment variable (`NESTJS_API_URL`) and never hard-code it.
- All API calls go through the feature's `services/` layer — never call `fetch` directly from a component or page.
- Create a shared `apiClient` utility in `shared/utils/apiClient.ts` that centralises base URL, default headers (e.g. `Authorization`, `Content-Type`), and error normalisation. All service files use this utility.
- Mirror the NestJS resource structure in your feature folders: a `users` NestJS module → `features/users/` on the frontend.
- Type the request and response shapes in each feature's `types.ts`. Do not use `any` for API payloads.
- Never expose raw NestJS error objects to the UI — normalise errors in the `services/` layer and surface user-friendly messages.

### Adding a new package — process
1. Open a ticket or discussion describing the need.
2. Evaluate whether the need can be met with a small custom utility (~50 lines) instead.
3. If a package is genuinely the right call, get at least one teammate's sign-off before running `npm install`.
4. Document the decision in `docs/dependencies.md` with the rationale.

---

## 2. Project Structure — Feature-based Architecture

Organize code by **feature/domain**, not by technical layer. Every feature is self-contained.

```
├── app/                          # Next.js App Router (routing only — no business logic)
│   ├── layout.tsx                # Root layout (global providers, fonts, metadata)
│   ├── page.tsx                  # Home route
│   └── <route-segment>/
│       ├── page.tsx
│       ├── layout.tsx            # (optional) nested layout
│       └── loading.tsx           # (optional) Suspense boundary UI
│
├── features/                     # One folder per product feature
│   └── <feature-name>/
│       ├── components/           # UI components used only inside this feature
│       ├── hooks/                # Custom hooks scoped to this feature
│       ├── services/             # NestJS API calls for this feature (use apiClient)
│       ├── types.ts              # TypeScript types & interfaces, incl. API request/response shapes
│       ├── utils.ts              # Pure helpers scoped to this feature
│       └── index.ts              # Public API — only export what other features need
│
├── shared/                       # Truly cross-cutting, reusable code
│   ├── components/               # Generic UI components (Button, Modal, Input…)
│   ├── hooks/                    # Generic hooks (useDebounce, useClickOutside…)
│   ├── styles/
│   │   └── globals.css           # Tailwind directives (@tailwind base/components/utilities) + base overrides
│   └── utils/
│       ├── apiClient.ts          # Centralised fetch wrapper (base URL, auth headers, error normalisation)
│       ├── cn.ts                 # Class merging helper (clsx + tailwind-merge)
│       └── …                     # Other pure utility functions (formatDate, …)
│
└── assets/                       # Static assets (images, fonts, icons)
```

### Rules
- Keep `app/` as thin as possible — it owns routing and layouts only; business logic lives in `features/`.
- A feature **must not** import directly from another feature's internals. Use the feature's `index.ts` public API only.
- `shared/` components must be **generic** — they must not know about any specific feature.
- If something is used by more than one feature, move it to `shared/`.

---

## 3. TypeScript

- `strict: true` is required in `tsconfig.json`. No exceptions.
- **No `any`**. Use `unknown` when the type is truly unknown, then narrow it.
- Export explicit types and interfaces from `types.ts` files; avoid inline type definitions in component props beyond simple cases.
- Prefer `interface` for object shapes and `type` for unions, intersections, and aliases.
- Name event handler types explicitly: `React.ChangeEvent<HTMLInputElement>`, not just `any`.

```ts
// ✅ Good
interface UserCardProps {
  userId: string;
  onSelect: (id: string) => void;
}

// ❌ Bad
const UserCard = ({ userId, onSelect }: any) => { ... }
```

- Do not suppress TypeScript errors with `// @ts-ignore` or `// @ts-expect-error` without a comment explaining why.

---

## 4. React & Next.js Components

### Component rules
- One component per file. File name matches the component name (`UserCard.tsx`).
- Use **function components** with hooks. No class components.
- Keep components **small and focused** — a component does one thing. If it grows beyond ~150 lines, consider splitting it.
- Default to **Server Components**. Add `"use client"` at the top of a file only when the component needs interactivity, browser APIs, or React hooks.

### Props
- Destructure props at the top of the component signature.
- Provide explicit default values where sensible.
- Do not spread unknown props onto DOM elements (`{...rest}` on a `<div>` is a last resort, never a default).

### Hooks
- Extract non-trivial logic into custom hooks. Name them `use<Something>`.
- Hooks can only live in Client Components (`"use client"`) or in files imported exclusively by them.
- Place feature-specific hooks in `features/<name>/hooks/`. Place generic hooks in `shared/hooks/`.
- Follow the [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks) — no conditionals around hook calls.

### State management
- Prefer local state (`useState`, `useReducer`) for UI state.
- Lift state only as high as needed — do not default to global state.
- Use React Context only for truly global or session-wide data (auth, theme). Keep context values stable; memoize them.
- Server state (data from the NestJS API) should live in Server Components where possible. For client-driven refetches, use `router.refresh()` or a lightweight local fetch — do not duplicate server state into a global store.
- Do **not** add a third-party state manager without team approval.

### Data fetching
- **Server Components** can fetch data directly from the NestJS API using `async/await` — pass the server-only `NESTJS_API_URL` and any auth credentials here so they never reach the client bundle.
- For client-side fetching (e.g., after user interaction), use custom hooks in the feature's `services/` layer, always going through `shared/utils/apiClient.ts`.
- **Never** call the NestJS API directly from a component — always go through the `services/` layer.
- Handle loading and error states explicitly; use Next.js `loading.tsx` and `error.tsx` conventions for route-level boundaries.
- Abort in-flight client requests when a component unmounts using `AbortController`.
- Tag `fetch` calls with `next: { tags: [...] }` or `revalidate` options in Server Components to enable Next.js cache invalidation when the NestJS data changes.

---

## 5. Tailwind CSS

Tailwind is the **only** styling tool. Do not introduce plain `.css` files, CSS-in-JS, or CSS Modules for new work.

### Core rules
- Apply styles via **utility classes in JSX**. Inline `style` props are allowed only for truly dynamic values that cannot be expressed with Tailwind (e.g. a runtime-calculated `width`).
- **No `@apply`** except in `globals.css` for genuine base/reset overrides (e.g. default body typography). Overusing `@apply` defeats the purpose of Tailwind.
- All design tokens — colours, spacing scale, font sizes, border radii, shadows — are defined in `tailwind.config.ts` under `theme.extend`. Never hard-code raw values like `#2563eb` in class strings; add a semantic token instead.

```ts
// tailwind.config.ts
export default {
  content: ['./app/**/*.{ts,tsx}', './features/**/*.{ts,tsx}', './shared/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        surface: '#ffffff',
        'text-base': '#111827',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
      },
    },
  },
};
```

### Class organisation
Keep class lists readable. Order classes by: layout → box model → typography → visual → interactive states. For long or conditional class lists, use the `cn()` helper from `shared/utils/cn.ts` (wraps `clsx` + `tailwind-merge`) — **do not** build class strings with template literals.

```tsx
// shared/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ✅ Good — readable and merge-safe
<div className={cn('flex items-center gap-2 rounded-md px-4 py-2', isActive && 'bg-primary text-white')} />

// ❌ Bad — template literal bypasses tailwind-merge deduplication
<div className={`flex items-center ${isActive ? 'bg-primary' : ''}`} />
```

> `clsx` and `tailwind-merge` must go through the team approval process in §1 before being added.

### Responsive design
Use Tailwind's **mobile-first breakpoint prefixes** (`sm:`, `md:`, `lg:`, `xl:`). Never write custom media queries in CSS files for layout.

```tsx
<div className="flex flex-col md:flex-row gap-4" />
```

### Dark mode
If the project supports dark mode, configure `darkMode: 'class'` in `tailwind.config.ts` and use `dark:` variants. The dark-mode toggle sets a `dark` class on `<html>`.

### Accessibility via Tailwind
- Use `focus-visible:ring-2 focus-visible:ring-primary` (or equivalent) on all interactive elements — never `outline-none` without a visible replacement.
- Use `motion-reduce:transition-none motion-reduce:animate-none` to respect `prefers-reduced-motion`.

```tsx
<button className="... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none" />
```

### What still lives in `globals.css`
Only the three Tailwind directives and any unavoidable base resets:

```css
/* shared/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base resets that Tailwind Preflight doesn't cover */
html {
  scroll-behavior: smooth;
}
```

---

## 6. File & Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| React component | PascalCase | `UserCard.tsx` |
| Next.js page / layout | lowercase (Next.js convention) | `page.tsx`, `layout.tsx` |
| API service file | camelCase | `userService.ts` |
| Custom hook | camelCase, `use` prefix | `useUserData.ts` |
| Utility function | camelCase | `formatDate.ts` |
| Type / Interface | PascalCase | `UserCardProps` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Feature folder | kebab-case | `user-profile/` |

---

## 7. Code Quality

- Run the linter and type-checker before committing. CI must pass both.
- No unused variables, imports, or dead code left in PRs.
- Write a short JSDoc comment on any function whose purpose is not immediately obvious from its name and signature.
- Keep functions **pure** where possible — same inputs, same outputs, no side effects.
- Avoid deeply nested ternaries in JSX. Extract to a variable or a helper function.

```tsx
// ✅ Good
const label = isLoading ? 'Loading…' : 'Save';
return <button>{label}</button>;

// ❌ Bad
return <button>{isLoading ? (hasError ? 'Error' : 'Loading…') : 'Save'}</button>;
```

---

## 8. Accessibility (a11y)

- Every interactive element must be reachable and operable via keyboard.
- Use semantic HTML first (`<button>`, `<nav>`, `<main>`, `<section>`, `<article>`). Reach for `<div>` + ARIA only when no semantic element fits.
- All images need an `alt` attribute. Decorative images get `alt=""`. Use `next/image` for all images.
- Form inputs must have an associated `<label>` (via `htmlFor` / `id`, not just placeholder text).
- Aim for WCAG 2.1 AA contrast ratios.

---

## 9. Performance

- Next.js handles **code splitting** per route automatically — no manual `React.lazy` needed for routes. Use `React.lazy` + `Suspense` only for heavy components loaded conditionally within a page.
- Memoize expensive computations with `useMemo`; memoize stable callbacks passed to child components with `useCallback`. Do not memoize everything — profile first.
- Prefer native browser features (`<dialog>`, `<details>`) over heavy custom implementations.
- Use `next/image` to automatically optimise images (resizing, lazy loading, modern formats).
- Keep bundle size in check: audit with `next build` output and `@next/bundle-analyzer` before merging large features.

---

## 10. Git & PR Hygiene

- Branch name: `feat/<feature>`, `fix/<issue>`, `chore/<task>`.
- Commit messages follow Conventional Commits: `feat: add UserCard component`.
- PRs must include a short description of what changed and why.
- No PRs that install a new package without the team approval described in §1.