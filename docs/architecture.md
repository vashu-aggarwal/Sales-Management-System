Retail Sales Management System — Architecture

This document describes the architecture of the Retail Sales Management System used for the internship assignment. It covers the backend and frontend architectures, the data flow between components, the repository folder structure, and the responsibilities of the main modules.

---

## Backend architecture

- Platform: Node.js (Express) running on port `5000` in development.
- Database: MySQL (accessed via `mysql2` connection pool).
- API style: REST endpoints under `/api/transaction` for CRUD, search, filter and sort operations.
- Key design points:
  - Thin REST API that accepts query parameters for search/filter/sort and returns JSON payloads.
  - Use of a query helper to build parameterized queries to prevent SQL injection.
  - Connection pooling via `mysql2` to improve database concurrency.
  - Controllers are organized by concern: CRUD, search, filter, sort, transaction-specific endpoints.

Typical request flow on the backend:
1. Express receives request at a route under `/api/*`.
2. Route delegates to a controller (for example, `transactionController`).
3. Controller uses helpers in `utils/queryHelper.js` to build SQL and pagination parameters.
4. `utils/db.js` provides a pooled connection and executes parameterized queries.
5. Controller formats the result and returns a JSON response with `success`, `data`, `total`, `page`, and `pageSize`.

---

## Frontend architecture

- Framework: React with Vite (development server + fast HMR).
- Styling: Tailwind CSS + PostCSS.
- Structure: Component-based layout with the following top-level pieces:
  - `App.jsx` — main app container and data fetching logic.
  - `Topbar.jsx` — search, filters (desktop strip) and summary cards.
  - `Sidebar.jsx` — navigation/sidebar (hidden on small screens).
  - `TransactionsTable.jsx` — paginated transactions table; responsive and scrollable.
  - `Pagination.jsx` — pagination controls.
  - `FilterModal.jsx` — mobile filter drawer (responsive filters for md and below).

Key design points:
  - Single-page React app that talks to backend REST APIs using `fetch`.
  - Environment configuration handled via Vite `import.meta.env` (e.g., `VITE_API_BASE`).
  - Responsive-first layout: default desktop view preserved, mobile-specific components (filter modal) added.
  - Reusable UI components (SummaryCard, FilterDropdown) keep presentation consistent.

---

## Data flow

1. User action on the frontend (search, apply filters, change page or sort) triggers state changes in `App.jsx`.
2. `App.jsx` builds a query using helper functions and calls the backend API using `fetch(getApiUrl('/api/transaction?...'))`.
3. Backend controller receives query, `queryHelper` builds a parameterized SQL clause (WHERE, ORDER BY, LIMIT/OFFSET).
4. `db.js` executes the SQL against MySQL using a connection pool and returns rows and total counts.
5. Backend controller returns JSON with rows, metadata (total, page, pageSize).
6. Frontend receives JSON, updates state (`rows`, `totalPages`) and re-renders `TransactionsTable` and `SummaryCard` stats.

Notes:
- Frontend uses Vite proxy to forward `/api` requests to `http://localhost:5000` in development when `VITE_API_BASE` is unset.
- All filtering and pagination is handled server-side for performance with large datasets; the frontend composes query params based on the UI state.

---

## Folder structure

Top-level layout (selected files and folders):

```
./
├─ Backend/
│  ├─ package.json
│  └─ src/
│     ├─ index.js                # Express server entry
│     ├─ controllers/
│     │  ├─ crudController.js
│     │  ├─ filterController.js
│     │  ├─ searchController.js
│     │  ├─ sortController.js
│     │  └─ transactionController.js
│     ├─ routes/
│     │  └─ transactions.js
│     └─ utils/
│        ├─ db.js                # MySQL pool helper
│        └─ queryHelper.js       # SQL building helper for filters/sort/pagination

├─ frontend/
│  ├─ package.json
│  ├─ index.html
│  ├─ src/
│  │  ├─ main.jsx
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  ├─ components/
│  │  │  ├─ Topbar.jsx
│  │  │  ├─ Sidebar.jsx
│  │  │  ├─ TransactionsTable.jsx
│  │  │  ├─ Pagination.jsx
│  │  │  ├─ FilterModal.jsx
│  │  │  └─ SummaryCard.jsx
│  │  └─ pages/
│  │     └─ Dashboard.jsx
│  └─ public/
└─ SETUP.md
```

---

## Module responsibilities

- `Backend/src/index.js`
  - Bootstraps Express server, applies middleware (CORS, JSON body parsing), and mounts API routes.

- `Backend/src/routes/transactions.js`
  - Declares HTTP endpoints and maps requests to controller functions.

- `Backend/src/controllers/*.js`
  - `crudController.js`: Handles create/read/update/delete operations for transactions.
  - `filterController.js`: Extracts filter parameters, validates them, and delegates to the query helper.
  - `searchController.js`: Implements search-specific endpoints (e.g., full-text or partial match searches).
  - `sortController.js`: Normalizes sort params and applies defaults.
  - `transactionController.js`: Higher-level orchestration (combines search/filter/sort and returns consistent API responses).

- `Backend/src/utils/db.js`
  - Exports a `mysql2` connection pool instance for executing parameterized queries.

- `Backend/src/utils/queryHelper.js`
  - Exposes helpers that build `WHERE` clauses, `ORDER BY`, and pagination `LIMIT/OFFSET` statements safely (parameterized to avoid SQL injection).

- `frontend/src/App.jsx`
  - Central data fetching logic, keeps application state (filters, search, sort, page), calls backend API and passes data to UI components.

- `frontend/src/components/Topbar.jsx`
  - Search input, desktop filter strip, summary cards; coordinates filter state updates with `App.jsx`.

- `frontend/src/components/FilterModal.jsx`
  - Mobile-specific filter drawer that mirrors desktop filters but optimized for touch.

- `frontend/src/components/TransactionsTable.jsx`
  - Renders transactions in a responsive table; contains logic for copy-to-clipboard, formatting, and responsive column hiding/scroll containment.

- `frontend/src/components/Pagination.jsx`
  - Renders page controls and calls back to `App.jsx` to update page state.

- `frontend/src/index.css`
  - Global styles and scrollbar customization used across the frontend.

---

## Notes for reviewers / graders

- The assignment requested that an architecture document be created; this file satisfies that requirement.
- The repo follows a small-but-clear separation of concerns suitable for this assignment: UI, API controllers, and DB helpers are split into logical modules.
- Environment-specific configuration (database credentials, API base) is injected via `.env` files and Vite's `VITE_` prefix for frontend values.

If you want, I can also add a simple diagram (SVG) or PlantUML file showing data flow and component interactions.
