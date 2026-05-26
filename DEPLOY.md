# Deploying Karthik P Portfolio to GitHub Pages

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `portfolio`
3. Set to **Public**
4. Do NOT initialize with README
5. Click "Create repository"

## Step 2: Push Code to GitHub

Run these commands in your terminal (inside the portfolio folder):

```bash
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/karthik22061212-Matrix/portfolio.git
git push -u origin main
```

## Step 3: Deploy to GitHub Pages

```bash
npm run deploy
```

This will:
- Build the React app
- Push the `build/` folder to a `gh-pages` branch automatically

## Step 4: Enable GitHub Pages

1. Go to your repo: https://github.com/karthik22061212-Matrix/portfolio
2. Click **Settings** → **Pages** (left sidebar)
3. Under "Source", select branch: `gh-pages`, folder: `/ (root)`
4. Click **Save**

## ✅ Your portfolio will be live at:
**https://karthik22061212-Matrix.github.io/portfolio**

(May take 2–5 minutes after first deploy)

## Updating the Portfolio Later

```bash
# Make your changes, then:
npm run deploy
```
