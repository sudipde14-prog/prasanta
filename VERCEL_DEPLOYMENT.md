# 🚀 Deploying to Vercel - Step by Step Guide

Follow these exact steps to deploy your app for client review:

## Step 1: Create Vercel Account (if you don't have one)

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub repositories

---

## Step 2: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find `sudipde14-prog/prasanta` in the list
3. Click **"Import"**

---

## Step 3: Configure the Project

### Framework Preset
- Vercel will auto-detect: **Next.js** ✅
- Keep it as is

### Root Directory
- **IMPORTANT:** Click "Edit" next to Root Directory
- Set it to: `frontend`
- Click **"Continue"**

### Build Settings
- Leave as default (Vercel will auto-configure)

---

## Step 4: Add Environment Variables

Click **"Environment Variables"** and add these:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` (You'll update this after deploying backend) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |

> **Note:** For now, use `http://localhost:3001` for API_URL. Once you deploy the backend to Render, you'll update this.

---

## Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. You'll get a URL like: `https://prasanta-xyz.vercel.app`

---

## Step 6: Share with Client

Send your client this URL:
```
https://prasanta-[your-url].vercel.app
```

**⚠️ Important Note for Client:**
The app will show errors because the **backend is not deployed yet**. The frontend works, but data won't load until you complete backend deployment on Render.

---

## Next: Deploy Backend to Render

After Vercel deployment, you need to:
1. Deploy backend to Render (see `RENDER_DEPLOYMENT.md`)
2. Update `NEXT_PUBLIC_API_URL` in Vercel settings with Render URL
3. Redeploy on Vercel

---

## 🔄 Updating Your Deployment

Whenever you push new code to GitHub:
- Vercel automatically redeploys
- No manual action needed!

---

## 🐛 Troubleshooting

**"Error: Not Found"**
- Make sure Root Directory is set to `frontend`

**"Build Failed"**
- Check if all environment variables are set correctly

**"Data not loading"**
- Backend is not deployed yet - this is expected
- Complete Render deployment next
