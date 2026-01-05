# Developer Handoff: Inventory & Ledger System

## 1. Project Overview
This is a full-stack web application designed for mobile-first inventory management and purchasing ledgers.
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS (Mobile-First Design).
- **Backend:** Node.js, Express.js.
- **Database:** Supabase (PostgreSQL).
- **Deployment:** Vercel (Frontend) + Render (Backend).

## 2. Repository Structure

### 📂 `frontend/`
The Next.js client application.
- **`src/app/`**: Contains all pages (App Router).
  - `page.tsx`: Dashboard/Home.
  - `items/`: Item management (CRUD).
  - `parties/`: Shop/Supplier management.
  - `purchases/`: Purchase entry and history.
  - `reports/`: Daily/Monthly summaries.
  - `globals.css`: **Core Design System** (Variables, Utility classes, Mobile styles).
- **`src/lib/`**:
  - `api.ts`: **Central API Client**. Contains all fetch calls to the backend. Configured via `NEXT_PUBLIC_API_URL`.
  - `supabase.ts`: Direct Supabase client.
- **`next.config.ts`**: Next.js configuration.
- **`package.json`**: Frontend dependencies (includes `@supabase/supabase-js`).

### 📂 `backend/`
The Express.js API server.
- **`server.js`**: **Entry Point**. Sets up middleware (CORS), health checks, and mounts routes.
- **`src/routes/`**: API Route handlers.
  - `items.js`, `parties.js`, `purchases.js`: Standard CRUD.
  - `stock.js`: Inventory calculations.
  - `reports.js`: Aggregation logic for summaries.
- **`src/lib/supabase.js`**: Backend Supabase client (Uses Service Role Key for secure access).

### 📂 `database/`
- **`schema.sql`**: Complete PostgreSQL schema. Defines tables (`parties`, `items`, `purchases`) and RLS policies.

## 3. Deployment Configuration

### Frontend (Vercel)
- **Framework Preset:** Next.js
- **Root Directory:** `frontend` (Important!)
- **Build Command:** `next build`
- **Environment Variables:**
  - `NEXT_PUBLIC_API_URL`: URL of the deployed backend (e.g., `https://your-app.onrender.com`).
  - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Public Key.

### Backend (Render)
- **Runtime:** Node
- **Root Directory:** `backend` (Important!)
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Environment Variables:**
  - `PORT`: `3001`
  - `SUPABASE_URL`: Your Supabase Project URL.
  - `SUPABASE_SERVICE_KEY`: **Secret** Service Role Key (from Supabase settings).
  - `FRONTEND_URL`: URL of the deployed frontend (for CORS).

## 4. Key Implementation Details
- **Mobile First:** The UI uses large touch targets (`48px` min) and simplified layouts defined in `globals.css`.
- **Type Safety:** The specific union types for Units (`KG`, `Packet`, etc.) are enforced in frontend pages.
- **Dual API Strategy:**
  - Most data flows through the Node.js backend (`api.ts`).
  - Authentication/Direct DB access is available via Supabase client if needed in future.

## 5. Quick Start for Developers
1.  Clone repository.
2.  **Backend:** `cd backend` -> `npm install` -> `node server.js`.
3.  **Frontend:** `cd frontend` -> `npm install` -> `npm run dev`.
4.  Ensure local `.env` files are set up matching the variables above.
