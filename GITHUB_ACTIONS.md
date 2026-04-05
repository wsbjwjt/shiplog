# GitHub Actions Setup

This project includes a GitHub Actions workflow for automatic deployment to Vercel.

## Setup Steps

### 1. Get Vercel Token

```bash
# Login to Vercel
vercel login

# Get token
vercel tokens create github-actions
```

### 2. Link Project (if not already linked)

```bash
vercel link
# Copy the .vercel/project.json values
```

### 3. Add GitHub Secrets

Go to https://github.com/wsbjwjt/shiplog/settings/secrets/actions

Add these secrets:

| Secret | Value |
|--------|-------|
| `VERCEL_TOKEN` | Your Vercel token from step 1 |
| `VERCEL_ORG_ID` | From `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | From `.vercel/project.json` |
| `DATABASE_URL` | Your PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random string (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your Vercel domain |

### 4. Get Project IDs

From `.vercel/project.json`:
```json
{
  "orgId": "your-org-id",
  "projectId": "your-project-id"
}
```

### 5. Manual Deploy

If you prefer not to use GitHub Actions, deploy manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## What the Workflow Does

1. **On Push to master:** Deploys to production
2. **On Pull Request:** Deploys preview version
3. **Build Process:**
   - Installs dependencies
   - Generates Prisma client
   - Builds Next.js app
   - Deploys to Vercel

## Monitoring Deployments

- Check Actions tab: https://github.com/wsbjwjt/shiplog/actions
- Vercel Dashboard: https://vercel.com/dashboard

## Troubleshooting

**Deployment fails:**
- Check all secrets are set correctly
- Verify Vercel token has correct permissions
- Check build logs in GitHub Actions

**Build fails:**
- Ensure DATABASE_URL is valid
- Check NextAuth configuration
