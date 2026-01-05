# 📒 Inventory & Ledger System

Simple, mobile-first inventory and ledger software for small shop owners.

## ✨ Features

- 📦 **Purchase Entry**: Large touch-friendly form for daily purchases
- 📊 **Stock Management**: Auto-updates with every purchase
- 🏪 **Party Ledger**: View supplier-wise purchase history
- 📈 **Reports**: Daily, monthly, and item-wise summaries with CSV export
- 🔒 **PIN Lock**: Optional 4-digit security
- 📱 **Mobile-First**: Designed for Android phones

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install both frontend and backend dependencies.

### 2. Configure Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. In SQL Editor, run the schema from `database/schema.sql`
3. Copy your credentials:
   - Project URL
   - Anon Key (for frontend)
   - Service Role Key (for backend)

### 3. Set Environment Variables

**Backend** (`backend/.env`):
```env
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_KEY=your_service_role_key
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run the App

```bash
npm run dev
```

This starts both servers:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## 📤 Pushing to GitHub

The code is ready to push! Run:

```bash
git push -u origin main
```

Enter your GitHub username (`sudipde14-prog`) and password when prompted.

---

## 🌐 Deployment

### Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set environment variables (from `frontend/.env.local`)
4. Deploy!

### Backend (Render)
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set Build Command: `npm install --prefix backend`
5. Set Start Command: `npm start --prefix backend`
6. Set environment variables (from `backend/.env`)
7. Deploy!

---

## 📖 Documentation

See [`walkthrough.md`](./.gemini/antigravity/brain/*/walkthrough.md) for detailed usage instructions.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (frontend), Render (backend)
