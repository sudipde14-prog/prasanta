# 🔧 Deploying Backend to Render

Complete this AFTER deploying frontend to Vercel.

## Step 1: Create Render Account

1. Go to **https://render.com**
2. Click **"Get Started"**
3. Sign up with GitHub

---

## Step 2: Create New Web Service

1. Click **"New"** → **"Web Service"**
2. Connect your GitHub account if not already connected
3. Find and select `sudipde14-prog/prasanta`
4. Click **"Connect"**

---

## Step 3: Configure Service

Fill in these details:

### Basic Settings
- **Name:** `prasanta-backend`
- **Region:** Choose closest to your location
- **Branch:** `main`
- **Root Directory:** `backend`

### Build & Deploy
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### Instance Type
- **Free** (for testing)
- Upgrade to **Starter ($7/month)** for production

---

## Step 4: Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_SERVICE_KEY` | Your Supabase Service Role Key |
| `PORT` | `3001` |
| `FRONTEND_URL` | Your Vercel URL (e.g., `https://prasanta-xyz.vercel.app`) |

---

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. You'll get a URL like: `https://prasanta-backend.onrender.com`

---

## Step 6: Update Vercel with Backend URL

1. Go back to **Vercel Dashboard**
2. Select your `prasanta` project
3. Click **"Settings"** → **"Environment Variables"**
4. Edit `NEXT_PUBLIC_API_URL`
5. Change from `http://localhost:3001` to: `https://prasanta-backend.onrender.com`
6. Click **"Save"**
7. Go to **"Deployments"** → Click **"..."** → **"Redeploy"**

---

## ✅ All Done!

Your app is now fully deployed:
- **Frontend:** https://prasanta-xyz.vercel.app
- **Backend:** https://prasanta-backend.onrender.com

Send the **Frontend URL** to your client!

---

## 📝 Notes

- Free Render services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Upgrade to paid plan ($7/mo) to keep it always active
