# Deployment Guide

This project is designed to deploy on free-tier services.

## Free-Tier Services
- **Backend API:** Render free web service
- **Database:** Neon free PostgreSQL project
- **Frontend:** Vercel free project or Netlify free site
- **CI:** GitHub Actions

## Branch-to-Environment Mapping
Replace placeholders after services are created.

| Branch | Environment | Frontend URL | Backend API URL |
| --- | --- | --- | --- |
| `dev` | Development | `https://fresh-shifts-dev.vercel.app` | `https://fresh-shifts-api-dev.onrender.com` |
| `staging` | Staging | `https://fresh-shifts-staging.vercel.app` | `https://fresh-shifts-api-staging.onrender.com` |
| `main` | Production | `https://fresh-shifts.vercel.app` | `https://fresh-shifts-api.onrender.com` |

## Backend: Render
Render can use the root `render.yaml` blueprint.

Backend settings:
- Root directory: `backend`
- Build command: `npm ci && npx prisma generate`
- Start command: `npx prisma migrate deploy && npm start`
- Health check path: `/api/health`

Required Render environment variables:
```text
NODE_ENV=production
PORT=10000
DATABASE_URL=<Neon pooled or direct PostgreSQL connection string>
JWT_SECRET=<generated secure secret>
FRONTEND_URL=<matching Vercel or Netlify frontend URL>
```

For three environments, create three Render services from the same repo and connect them to:
- `dev`
- `staging`
- `main`

Each service should use its own Neon database or at least its own Neon database branch.

## Database: Neon
Create a free Neon project.

Recommended setup:
- `dev` branch database for development
- `staging` branch database for staging validation
- `main` branch database for production

Use the Neon connection string as `DATABASE_URL` in Render.

## Frontend: Vercel
Use the `frontend` folder as the Vercel project root.

Vercel config:
- Config file: `frontend/vercel.json`
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

Required Vercel environment variable:
```text
VITE_API_URL=https://<render-backend-url>/api
```

For three environments, create one Vercel project with branch deployments or three projects mapped to:
- `dev`
- `staging`
- `main`

## Frontend: Netlify Alternative
Use the `frontend` folder as the Netlify base directory.

Netlify config:
- Config file: `frontend/netlify.toml`
- Build command: `npm run build`
- Publish directory: `dist`

Required Netlify environment variable:
```text
VITE_API_URL=https://<render-backend-url>/api
```

## CI/CD
GitHub Actions currently validates pull requests and pushes to `dev`, `staging`, and `main`.

Workflow evidence:
- Installs backend dependencies
- Validates Prisma schema
- Generates Prisma client
- Runs backend tests
- Installs frontend dependencies
- Builds frontend

Platform deployments are handled by Render and Vercel/Netlify branch integrations after GitHub pushes pass CI.

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
