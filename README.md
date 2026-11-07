# Grantly

**Find the scholarships you actually qualify for.**

Grantly is a discovery-and-management companion for educational financial assistance in India. Built for **THE OUTPOST** by Frontend Arena.

> Live demo: https://grantly.vercel.app _(replace with your deployment URL)_
> Repo: https://github.com/your-handle/grantly _(replace with your repository URL)_

---

## The problem

Applying for financial aid in India usually means scattered PDFs, twenty open tabs, and eligibility rules buried in dense notifications. Students lose track of deadlines, re-collect the same certificates for every scheme, and often do not know whether they are even eligible until they have spent hours reading.

Grantly turns that into a single calm journey for students from school (Class 9) through postgraduate study.

## The approach: Find → Check → Apply → Track

| Step | Screen | What it does |
| --- | --- | --- |
| **Find** | `/discover` | Debounced search, amount/deadline/category/level/provider filters, three sort modes, match badges, save buttons. |
| **Check** | `/scholarship/[id]` | A six-criterion eligibility checklist (met / not met / need info), one-line reason, required documents, plain-language application steps, and a Simple mode. |
| **Apply** | `/documents` | One merged document checklist across every saved scholarship. Tick once, reused everywhere. |
| **Track** | `/dashboard` | Saved → Preparing → Applied → Result board, "due this week" strip, deadline timeline and funding stats. |

The student builds a short profile **once** (education level, course, state, category, income bracket, optional gender). Everything after that is personalised and explained in plain language.

## Feature list

- **Landing + onboarding** — hero, four-step how-it-works, 4-question profile stepper with visible labels, inline error text, per-step skip, "browse without a profile" fallback, and an editable profile summary.
- **Discover** — debounced (250 ms) search capped at 80 characters, five filters, three sorts, active filter chips with "Clear all", `aria-live` result count, skeleton loading, empty state with reset, and a mobile filter dialog with focus trap, Escape handling and focus restoration.
- **Scholarship detail** — plain-language summary, amount, deadline, provider, verified official link, eligibility checklist with score and one-line reason, simple mode, document checklist, five-step how-to-apply, related schemes.
- **Dashboard** — saved/applied/potential-funding stats, due-this-week strip, four-column status board moved with accessible `<select>` controls (no drag and drop), upcoming deadline timeline, and an empty state.
- **Documents** — deduplicated document library across saved scholarships, progress ring plus "7 of 10 documents ready" text, and the scholarships each document unlocks.
- **Compare (bonus)** — up to three scholarships side by side with amount, deadline, eligibility, documents and match score.
- **Extras** — light/dark theme, responsive bottom tab bar on mobile, on-brand 404 and error pages, sitemap and robots.

## How matching works

`src/lib/match.ts` is a pure function: `matchScore(profile, scholarship)`.

Every scholarship is reduced to six criteria, each weighted by how decisive it is:

| Criterion | Weight | Unknown state |
| --- | --- | --- |
| Education level | 25 | "Need info" |
| Community category | 20 | "Need info" |
| Family income | 20 | Bracket straddles the limit → "Need info" |
| State domicile | 20 | "Need info" |
| Course | 10 | Profile course empty → "Need info" |
| Gender | 5 | Profile gender empty → "Need info" |

- **Met** earns the full weight, **need info** earns half, **not met** earns nothing. The weighted total is rounded to a 0–100 score.
- The same evaluation produces `reasons` (what fits), `missing` (what blocks you) and a one-line `summary`, so the UI never has to re-derive logic.
- No profile means `score: null` and the UI shows "Complete your profile to see your match".
- No clever tuning: the weights, the arithmetic and the copy live in one readable file.

## Tech stack (and why it is minimal)

| Tool | Why |
| --- | --- |
| Next.js 16 (App Router) + React 19 + TypeScript (`strict: true`) | Server Components by default, static generation for all screens, typed data end-to-end. |
| Tailwind CSS v4 | Design tokens in CSS variables (`@theme inline`), zero runtime cost. |
| `zod` | Validates the profile and every localStorage read; malformed data is silently replaced with defaults. |
| `lucide-react` | Individual icon imports only — no icon font, no icon sprite. |

No state library, no animation library, no UI kit, no database, no authentication. Persistence is `localStorage`, read **after** mount so server and client markup always match. The only backend route in the project is the platform health check (`/api/health`); the product itself is client-side by design.

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx            # fonts, metadata, header/footer, providers
│  ├─ page.tsx              # landing + onboarding
│  ├─ discover/             # discovery experience + loading skeleton
│  ├─ scholarship/[id]/     # detail (statically generated)
│  ├─ dashboard/            # status board and deadlines
│  ├─ documents/            # merged document checklist
│  ├─ compare/              # bonus comparison view
│  ├─ error.tsx             # on-brand error boundary
│  ├─ not-found.tsx         # on-brand 404
│  ├─ icon.svg              # favicon
│  ├─ robots.ts / sitemap.ts
│  └─ api/health/route.ts   # platform health check
├─ components/
│  ├─ layout/               # header, tab bar, footer, theme toggle
│  ├─ ui/                   # Button, Badge, Dialog, ProgressRing, Skeleton…
│  ├─ onboarding/           # profile stepper + summary
│  ├─ discover/             # explorer, filters, cards, badges
│  ├─ detail/               # eligibility, documents, status actions
│  ├─ dashboard/            # stats, board, timeline
│  ├─ documents/            # aggregated checklist
│  ├─ compare/              # comparison tool
│  └─ providers/            # one small context store
├─ data/scholarships.ts     # 25 typed sample scholarships
├─ hooks/                   # useLocalStorage, useDebouncedValue, useTheme
├─ lib/                     # match, dates, storage, schemas, discover, format
└─ types/                   # shared domain types and option lists
```

## State model

One context (`GrantlyProvider`) wraps three `useLocalStorage` values:

1. **Profile** — validated with `studentProfileSchema`.
2. **Tracker** — `{ [scholarshipId]: { status, updatedAt } }`, validated with `trackerSchema`.
3. **Documents** — ticked document names, validated with `savedDocumentsSchema`.

`useLocalStorage` never touches storage during render. `ready` is `false` until the post-mount read completes, which is why every personalised screen renders a skeleton first — there is no hydration mismatch, and corrupted storage silently falls back to defaults.

## Accessibility

- Landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, ordered headings, and a "Skip to main content" link.
- Everything is usable by keyboard: stepper, filters (including the modal), status board, document ticks, comparison selects.
- Dialogs trap focus, close on Escape, lock background scrolling and return focus to the triggering control.
- Visible 2px+ focus rings using a dedicated `--focus` token in both themes.
- Every input has a visible label; errors are linked with `aria-describedby`; result counts and status changes use `aria-live`; icon-only buttons carry `aria-label`.
- Deadline urgency and eligibility state always pair colour with an icon **and** text.
- WCAG AA contrast in light and dark themes, 44px minimum touch targets, and `prefers-reduced-motion` disables animation and smooth scrolling.

## Security

- Strict security headers in `next.config.ts`: CSP (`default-src 'self'`), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` (camera, microphone, geolocation denied) and `X-Frame-Options: DENY`.
- No `dangerouslySetInnerHTML`, no `eval`, no `innerHTML`; all user text is rendered as plain React text.
- All free text is normalised, stripped of control characters and angle brackets, whitespace-collapsed and length-limited; search is capped at 80 characters and the course field at 60.
- Every stored value is schema-validated on read; failures fall back silently instead of throwing.
- External links only render when they are valid `https://` URLs (checked in `src/lib/links.ts`), with `target="_blank"` and `rel="noopener noreferrer"`, plus a screen-reader note.
- Minimal, well-known dependencies and a committed `package-lock.json`. `npm audit fix` has been applied; the only remaining production advisory is inherited by Next.js through its optional `sharp` image pipeline, which Grantly does not use (no `next/image`).

## Performance

- Server Components by default; interactivity isolated in small client islands.
- All marketing, detail and shell pages are statically prerendered (`●` / `○` in the build output).
- Inter is self-hosted through `next/font` with `display: swap` — no external font or CDN request, no layout shift.
- No images: icons are inline SVG, decoration is CSS. Card, skeleton and badge heights are reserved to keep CLS near zero.
- No animation library; transitions are CSS-only and respect reduced motion.

## Sample data disclosure

The 25 scholarships in `src/data/scholarships.ts` are **sample data for demonstration**. Scheme names, amounts and eligibility patterns are modelled on well-known Indian programmes, but every value is illustrative. Official links point only at well-known portal **home pages** (National Scholarship Portal, UGC, AICTE, state portals, foundations); no fake application URLs are invented.

Deadlines are calculated at runtime relative to today (`isoDaysFromToday`) so the demo spreads across the next 60 days and never becomes stale.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Quality gates:

```bash
npm run lint       # eslint-config-next, core-web-vitals — zero warnings
npx tsc --noEmit   # strict TypeScript
npm run build      # production build
npm run start      # serve the production build
```

## Assumptions

1. No accounts or server storage: all personal data lives in this browser's `localStorage` and is never transmitted.
2. Income is captured as a bracket; when a bracket straddles a scheme's limit the criterion is shown as "need info" rather than a guess.
3. Course matching uses simple keyword overlap, which is enough for the sample dataset.
4. Ranking is a transparent weighted checklist, not a prediction of an award decision.
5. The remaining `npm audit` advisory is in Next.js's optional `sharp` dependency, which this app never invokes.
