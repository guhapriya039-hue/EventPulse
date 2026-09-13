# Vercel deployment guide for EventPulse

This guide explains how to deploy EventPulse to Vercel and configure GitHub Actions to automatically deploy on pushes to the main branch.

Prerequisites

- A Vercel account (https://vercel.com)
- Vercel CLI (optional) for manual deploys: `npm i -g vercel`
- GitHub repository with the project code

Option A — Automatic deploy using GitHub Actions (recommended)

1. Add GitHub Actions workflow

Create a file at `.github/workflows/vercel-deploy.yml` with the following content:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          npm ci

      - name: Build (optional)
        run: |
          if [ -f package.json ] && grep -q "build" package.json; then npm run build || true; fi

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: .
          vercel-args: '--prod'
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

2. Add required repository secrets in GitHub

- VERCEL_TOKEN: Create a personal token in Vercel (Account Settings → Tokens) and paste it here.
- VERCEL_ORG_ID: Found in your Vercel project settings or organization settings.
- VERCEL_PROJECT_ID: Found in the Vercel project settings (Project → Settings → General → Project ID).

3. Push to main to trigger deployment

When you push to the main branch, the workflow will run and deploy to Vercel (prod).

Option B — Manual deploy with Vercel CLI

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Run deploy from project root and follow prompts:

```bash
vercel --prod
```

Notes and troubleshooting

- If your project uses environment variables, add them in the Vercel dashboard (Project → Settings → Environment Variables) or store them securely in GitHub secrets and pass them via the Action if needed.
- If build fails, check the Action logs and adjust the build step or node version.

If you'd like, I can generate the exact workflow file customized to your package.json scripts or create a PR with the workflow if you grant me write access. Which would you prefer?