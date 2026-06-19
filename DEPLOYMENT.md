# Deployment Guide

This project is designed to deploy on free-tier services without Render.

## Free-Tier Services
- **Full-stack app:** Vercel free project
- **Database:** Neon free PostgreSQL project
- **CI:** GitHub Actions

## Branch-to-Environment Mapping
Replace placeholders after Vercel projects are created.

| Branch | Environment | App URL | Database |
| --- | --- | --- | --- |
| `dev` | Development | `https://fresh-shifts-dev.vercel.app` | Neon dev branch |
| `staging` | Staging | `https://fresh-shifts-staging.vercel.app` | Neon staging branch |
| `main` | Production | `https://fresh-shifts.vercel.app` | Neon production database |

## Vercel Full-Stack Deployment
The root `vercel.json` deploys:
- React/Vite frontend from `frontend`
- Express API as a serverless function from `api/index.js`
- API routes under `/api/*`

Vercel settings:
- Project root: repository root
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `frontend/dist`

Required Vercel environment variables:
```text
NODE_ENV=production
DATABASE_URL=<matching Neon PostgreSQL connection string>
JWT_SECRET=<strong generated secret>
FRONTEND_URL=<matching Vercel app URL>
```

Create three Vercel projects or branch deployments:
- `fresh-shifts-dev` connected to `dev`
- `fresh-shifts-staging` connected to `staging`
- `fresh-shifts` connected to `main`

## Database: Neon
Create a free Neon project.

Recommended setup:
- `dev` branch database for development
- `staging` branch database for staging validation
- `main` branch database for production

Use each Neon connection string as `DATABASE_URL` in the matching Vercel project.

## CI/CD
GitHub Actions validates pull requests and pushes to `dev`, `staging`, and `main`.

Workflow evidence:
- Installs backend dependencies
- Audits high-severity backend dependencies
- Validates Prisma schema
- Generates Prisma client
- Runs backend tests
- Installs frontend dependencies
- Audits high-severity frontend dependencies
- Builds frontend

Vercel handles deployment after GitHub pushes pass CI.

## Local Demo Without Paid Services
For local demo without PostgreSQL:
```powershell
cd backend
$env:USE_IN_MEMORY_DB="true"
$env:JWT_SECRET="local-demo-secret"
npm run dev
```

In another terminal:
```powershell
cd frontend
npm run dev
```

Open:
```text
http://localhost:5173
```
