# 🚀 Deployment Environment Variables Guide

Copy these values to your deployment platforms.

## 1️⃣ Render (Backend)
Go to: **Dashboard** -> **YOUR_SERVICE** -> **Environment**

| Key | Value |
| :--- | :--- |
| `PORT` | `3001` |
| `SUPABASE_URL` | *[Your Supabase Project URL]* |
| `SUPABASE_SERVICE_KEY` | *[Your Supabase **SERVICE_ROLE** Secret]* (Not Anon!) |
| `FRONTEND_URL` | *[Your Vercel URL]* (e.g. `https://inventory-app.vercel.app`) |

*(Remove trailing slashes from URLs)*

---

## 2️⃣ Vercel (Frontend)
Go to: **Dashboard** -> **Settings** -> **Environment Variables**

| Key | Value |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | *[Your Render Backend URL]* (e.g. `https://inventory-backend.onrender.com`) |
| `NEXT_PUBLIC_SUPABASE_URL` | *[Your Supabase Project URL]* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *[Your Supabase **ANON** Public Key]* |

*(Remove trailing slashes from URLs)*
