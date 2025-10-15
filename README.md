# ConsentMD Front-End

Next.js (App Router) client used by patients and doctors to interact with the ConsentMD consent-management platform. The UI consumes the Node/Express API, displays ledger-backed consent status, and provides access to uploaded medical records.

---

## Features

- **Role-aware dashboards** – Separate patient/doctor panels with metrics (records, active consents, consultations, accessible records).
- **Consent workflows** – Create records, grant or revoke access, and view request timelines from `dashboard/records` and `dashboard/consent` routes.
- **Consultation management** – Patients book sessions; doctors review pending requests (`dashboard/consultations`).
- **Secure file handling** – Uses signed URLs from the API to upload/download EHR documents. Bucket name is provided via environment variables.
- **State management** – Redux Toolkit store (`src/store`) backed by JWT cookies for authentication; hooks auto-refresh dashboard stats.
- **Modern UI stack** – Next.js 15, React 19, Tailwind CSS, Radix UI primitives, lucide-react icons, and `react-hook-form` + `zod` validation.

---

## Prerequisites

| Dependency | Version |
|------------|---------|
| Node.js | ≥ 18 (required by Next.js 15) |
| npm | ≥ 8 |
| ConsentMD API | Running instance of the backend (`api/`) to serve data |

Ensure the API is reachable (local or deployed) before launching the client.

---

## Installation

```bash
cd client
npm install
```

This installs Next.js, Redux Toolkit, TailwindCSS, and other dependencies.

---

## Environment Configuration

Create or edit `client/.env` with the following keys:

```
NEXT_PUBLIC_AWS_S3_BUCKET_NAME=<ehr-bucket-name>
REACT_APP_BASE_URLDNS=https://api.consentmd.online/v1   # or your local API URL
```

- `REACT_APP_BASE_URLDNS` is read by `src/services/api.ts` and should point to the API base path (include `/v1`).
- `NEXT_PUBLIC_*` variables are exposed to the browser; use them for S3 bucket references or other public settings.

Restart the dev server whenever environment variables change.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack at `http://localhost:3000` |
| `npm run build` | Create a production build (`.next/`) |
| `npm start` | Serve the production build |
| `npm run lint` | Run Next.js ESLint configuration |

---

## Application Structure (selected directories)

```
src/
├── app/
│   ├── (auth)/          # Login, register, password flows
│   ├── dashboard/       # Patient/doctor dashboards & nested routes
│   ├── layout.tsx       # Root layout, providers
│   └── page.tsx         # Landing page
├── components/          # UI primitives (buttons, tables, dialogs)
├── services/api.ts      # Axios instance with JWT cookie interceptor
├── store/               # Redux Toolkit slices & hooks
└── styles/globals.css   # Tailwind base styles
```

Routing is App Router based; nested segments under `dashboard/` render in the shared layout.

---

## Authentication Flow

1. Users authenticate via `/login` or `/register` (auth routes). JWT access tokens are stored as cookies.
2. `src/services/api.ts` attaches the `Authorization` header on each request if a cookie is present.
3. Protected pages pull the current user from Redux (`useAppSelector(state => state.auth)`); redirect guards live in the page components.

---

## Connecting to the API

The client expects the API to expose the REST endpoints described in `api/README.md`. Key integrations:

- `/v1/records` – Create records, fetch patient-owned records, generate signed URLs.
- `/v1/records/accessible` – Doctors view records they have consent for.
- `/v1/consultations` – Manage telemedicine consultation slots.
- `/v1/auth/*` – Login, register, password reset.

Update `REACT_APP_BASE_URLDNS` if your API runs on a different host or port.

---

## Development Tips

- Tailwind classes are available globally; see `tailwind.config.js` for theme settings.
- `react-pdf` is used to preview uploaded PDFs — ensure browser supports required APIs.
- Cookies (`js-cookie`) handle tokens; if you encounter auth issues, clear cookies or inspect the network tab for the `Authorization` header.
- If you add new environment variables, prefix them with `NEXT_PUBLIC_` (or adapt the code to reference them from `process.env`).

---

## Troubleshooting

- **401 Unauthorized** – Confirm the API is reachable and the JWT cookie exists. Logging out and in again usually refreshes the token.
- **S3 upload failures** – Verify AWS credentials on the API side; the client only uses the signed URL it receives.
- **API base URL still pointing to production** – Restart dev server after editing `.env` or set `REACT_APP_BASE_URLDNS` before `npm run dev`.
- **Tailwind styles missing** – Ensure `globals.css` is imported in `src/app/layout.tsx`.

Refer to the root project README for overall architecture and benchmark results.
