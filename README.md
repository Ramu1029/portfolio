# Ram — Full Stack Developer Portfolio

A premium, animated developer portfolio with a protected admin dashboard, built with React, Express, and SQLite.

## Project structure

```
portfolio/
├── backend/                   # Express + SQLite API
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.js       # DB connection + schema (auto-creates tables)
│   │   │   └── seed.js        # Seeds admin user + sample data
│   │   ├── middleware/
│   │   │   ├── auth.js        # requireAuth / requireAdmin
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── auth.js        # register/login/logout/me
│   │   │   ├── projects.js    # full CRUD example (public + admin)
│   │   │   ├── genericCrud.js # CRUD factory used by resources.js
│   │   │   ├── resources.js   # skills/experience/achievements/certifications/social-links
│   │   │   ├── singletons.js  # hero/about/settings
│   │   │   ├── contact.js     # contact form + admin inbox
│   │   │   └── upload.js      # image upload (admin only)
│   │   ├── utils/auth.js      # JWT signing/verification
│   │   └── server.js          # app entry point
│   ├── uploads/                # uploaded images (created at runtime)
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # React + Vite + Tailwind + Framer Motion
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Footer, Loader
│   │   │   ├── sections/       # Hero, About, Skills, Experience, Projects, Contact...
│   │   │   ├── ui/             # MagneticButton
│   │   │   └── admin/          # AdminLayout, ResourceManager, ConfirmDialog, ImageUploadField, ProtectedRoute
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── admin/          # AdminLogin, AdminDashboard, AdminProjects, AdminSkills, ...
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/useReveal.js
│   │   ├── utils/api.js        # axios instance (httpOnly cookie auth)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js          # proxies /api and /uploads to backend in dev
│   ├── .env.example
│   └── package.json
│
└── README.md (this file)
```

## A note on authentication

The brief asked for Auth.js (NextAuth), which is built specifically for Next.js applications. Since this project uses React (Vite) + Express rather than Next.js, Auth.js isn't directly compatible. Instead, this scaffold implements the same security model — sessions, role-based authorization, server-side enforcement — using:

- `bcryptjs` for password hashing
- `jsonwebtoken` for signed session tokens
- An **httpOnly, sameSite cookie** to store the session (not localStorage — avoids XSS token theft)
- A `users` table in SQLite with a `role` column (`admin` | `user`)

Role assignment rule (matches the spec exactly): on first registration/login, if the email matches `ADMIN_EMAIL` from the backend `.env`, the user is created with `role = admin`. Everyone else gets `role = user`. This is enforced only in `backend/src/routes/auth.js`, never trusted from client input.

If you later migrate to Next.js, this backend's role model drops into Auth.js's `callbacks.session`/`callbacks.jwt` with minimal changes.

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env: set ADMIN_EMAIL, ADMIN_PASSWORD, and a strong JWT_SECRET
npm install
npm run seed     # creates your admin user + sample projects/skills
npm run dev      # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # starts on http://localhost:5173
```

Visit `http://localhost:5173` for the public site and `http://localhost:5173/admin/login` for the dashboard (sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `backend/.env`).

## Security model

- Every write operation (`POST`/`PUT`/`DELETE`) on every resource passes through `requireAuth` then `requireAdmin` on the backend — the frontend's `ProtectedRoute` is a UX convenience only, never the actual gate.
- `requireAdmin` re-reads the user's role from SQLite on every request rather than trusting the JWT payload, so a role downgrade takes effect immediately.
- Public project/content endpoints only ever return `status = 'published'` rows; drafts are admin-only.
- The contact form is rate-limited (5 submissions / 15 min / IP) to deter spam.
- Passwords are hashed with bcrypt (10 rounds); sessions live in httpOnly cookies, not localStorage.

## Extending

- **More admin resources**: follow the pattern in `backend/src/routes/resources.js` (wraps `genericCrud.js`) and `frontend/src/components/admin/ResourceManager.jsx` (config-driven CRUD UI) — most new content types only need a new schema table + a few lines of config, no new UI code.
- **Social links / resume management**: the `social_links` API and table already exist (`/api/social-links`); wire up an `AdminSocialLinks` page the same way `AdminSkills` was built if you want it in the dashboard nav.
- **Swap SQLite for Postgres**: only `backend/src/db/index.js` needs to change; all route files use parameterized queries via `better-sqlite3`'s `.prepare()`, which maps closely to most SQL clients.
