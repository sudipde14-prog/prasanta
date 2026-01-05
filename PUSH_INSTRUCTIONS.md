# 🚀 How to Push Your Code to GitHub

Follow these steps **exactly** to upload your code:

## Step 1: Open PowerShell in Your Project Folder

You should already have a terminal open in `C:\Users\sd876\prasanta`

## Step 2: Run the Push Command

Copy and paste this command:

```powershell
git push -u origin main
```

Press **Enter**.

## Step 3: Authenticate with GitHub

GitHub will ask you to log in. **One of these will happen:**

### Option A: Browser Window Opens
- A browser window will pop up automatically
- Click "Sign in with your browser"
- Log in with username: `sudipde14-prog`
- Click "Authorize" when asked
- Return to the terminal - the push will complete automatically!

### Option B: Terminal Asks for Password
If no browser opens, the terminal will ask for your password:
```
Username for 'https://github.com': 
```
Type: `sudipde14-prog` and press Enter

```
Password for 'https://sudipde14-prog@github.com':
```
**IMPORTANT:** 
- You CANNOT use your GitHub password here anymore
- You MUST use a **Personal Access Token**

#### How to Get a Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: `Prasanta Push`
4. Check the box: ✅ **repo** (all sub-boxes)
5. Click "Generate token" at the bottom
6. **COPY THE TOKEN** (you'll only see it once!)
7. Paste it as your password (it won't show as you type - this is normal)
8. Press Enter

## Step 4: Wait for Upload

You'll see output like:
```
Enumerating objects: 123, done.
Counting objects: 100% (123/123), done.
Writing objects: 100% (123/123), 45.67 KiB | 1.52 MiB/s, done.
Total 123 (delta 0), reused 0 (delta 0)
To https://github.com/sudipde14-prog/prasanta.git
 * [new branch]      main -> main
```

## ✅ Success!

Your code is now on GitHub at:
**https://github.com/sudipde14-prog/prasanta**

---

## ⚠️ If You Get an Error

**"Permission denied (403)":**
- You entered the wrong password/token
- Try again, make sure to use the **token**, not your GitHub password

**"Repository not found":**
- Make sure the repository exists on GitHub
- Create it at: https://github.com/new

**"Authentication failed":**
- Your token might have expired
- Generate a new one at: https://github.com/settings/tokens

---

## 🎯 After Successful Push

1. Go to https://github.com/sudipde14-prog/prasanta
2. You should see all your code!
3. Next: Deploy to Vercel (frontend) and Render (backend)
