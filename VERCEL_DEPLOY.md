# ShipLog Deployment Guide

**Repository:** https://github.com/wsbjwjt/shiplog
**Status:** ✅ Code pushed, ready to deploy

## Quick Deploy

### Option 1: Vercel CLI (Recommended)

```bash
# 1. Login to Vercel
vercel login

# 2. Deploy
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository: `wsbjwjt/shiplog`
3. Configure environment variables (see below)
4. Click Deploy

## Required Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-random-secret-key

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-app-id
GITHUB_CLIENT_SECRET=your-github-app-secret

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Setup Steps

### 1. Database Setup (Supabase)

1. Go to https://supabase.com and create project
2. Get connection string from Settings → Database
3. Add to Vercel environment variables

### 2. OAuth Setup

**GitHub:**
1. Go to https://github.com/settings/developers
2. New OAuth App
3. Authorization callback URL: `https://your-domain.vercel.app/api/auth/callback/github`
4. Copy Client ID and Secret

**Google:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client
3. Authorized redirect URIs: `https://your-domain.vercel.app/api/auth/callback/google`
4. Copy Client ID and Secret

### 3. Run Database Migrations

After first deploy, run:
```bash
# Locally
npx prisma migrate deploy

# Or using Vercel Console
# Add POSTGRES_URL and run migration
```

### 4. Configure NEXTAUTH_URL

Update environment variable after getting Vercel domain:
```bash
NEXTAUTH_URL=https://shiplog-xxx.vercel.app
```

## Build Configuration

Vercel will auto-detect Next.js. Add `vercel.json` if needed:

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs"
}
```

## Post-Deployment Checklist

- [ ] Database connected
- [ ] Migrations run
- [ ] OAuth callbacks configured
- [ ] Environment variables set
- [ ] Login flow tested
- [ ] Dashboard accessible
- [ ] Public pages working
- [ ] OG images generating

## Troubleshooting

**Build fails:**
- Check DATABASE_URL is set
- Run `npx prisma generate` locally

**Auth not working:**
- Verify NEXTAUTH_SECRET is set
- Check OAuth callback URLs match

**Database errors:**
- Ensure migrations deployed
- Check connection string format

## One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wsbjwjt/shiplog)

---

**Your repository:** https://github.com/wsbjwjt/shiplog
**Ready to deploy!**
