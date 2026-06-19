# Fresh Shifts - Candidate Management System

## Project Overview
This repository contains a small full-stack Candidate Management System for the Fresh Shifts assessment. It supports authenticated HR users, candidate profile management, interview notes, candidate scoring, and dashboard metrics.

Current implementation status:
- Backend API: implemented
- Frontend UI: implemented
- Automated backend tests: implemented
- GitHub Actions CI: implemented
- Free-tier deployment plan: documented below

## Implemented Features
- User registration and login with JWT authentication
- Password hashing with bcrypt
- Protected candidate API routes
- Candidate create, list, detail, update, and delete endpoints
- Candidate status tracking with allowed statuses:
  - Applied
  - Shortlisted
  - Interviewed
  - Selected
  - Rejected
- Candidate scoring:
  - Technical Skills
  - Communication Skills
  - Reliability
- Interview notes stored on the candidate record
- Dashboard metrics:
  - Total candidates
  - Selected candidates
  - Rejected candidates
  - Average technical, communication, and reliability scores
- Automated API tests using Vitest and Supertest
- Test-only in-memory database adapter for reliable zero-cost CI tests
- React frontend for login, candidate list, candidate create/edit, notes, scores, and dashboard
- Rate limiting on authentication endpoints

## Technology Choices
- **Frontend:** React and Vite
- **Backend:** Node.js and Express.js
- **Database ORM:** Prisma
- **Database:** PostgreSQL for development/staging/production
- **Testing:** Vitest and Supertest
- **Authentication:** JWT and bcrypt
- **CI/CD:** GitHub Actions

## Repository Structure
```text
candidate-management-system/
  DEPLOYMENT.md
  docs/
    submission-checklist.md
  render.yaml
  .github/workflows/ci.yml
  backend/
    prisma/
      schema.prisma
      migrations/
    src/
      config/
      controllers/
      middleware/
      routes/
      index.js
    tests/
    package.json
  frontend/
    src/
    index.html
    netlify.toml
    package.json
    vercel.json
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file using `backend/.env.example` as a template.
4. Set required environment variables:
   ```text
   DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
   JWT_SECRET="replace-with-a-secure-secret"
   NODE_ENV="development"
   PORT=3000
   ```
5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
6. Start the backend server:
   ```bash
   npm run dev
   ```

For a quick local demo without PostgreSQL, set:
```text
USE_IN_MEMORY_DB="true"
JWT_SECRET="local-demo-secret"
```

This stores data in memory until the backend process stops.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file using `frontend/.env.example` as a template.
4. Set the API URL:
   ```text
   VITE_API_URL=http://localhost:5000/api
   ```
5. Start the frontend:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:5173`.

## Testing
Run the backend test suite:
```bash
npm test
```

The test suite uses `NODE_ENV=test` and a test-only in-memory Prisma-compatible adapter. This keeps tests deterministic and avoids any paid database dependency in CI.

Current verified result:
```text
Test Files  5 passed (5)
Tests       23 passed (23)
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Candidates
All candidate routes require a Bearer token.

- `GET /api/candidates`
- `GET /api/candidates/:id`
- `POST /api/candidates`
- `PUT /api/candidates/:id`
- `DELETE /api/candidates/:id`
- `GET /api/candidates/dashboard`

## Validation Rules
- `name` is required when creating a candidate.
- `email` must be valid and unique.
- `status` must be one of: `Applied`, `Shortlisted`, `Interviewed`, `Selected`, `Rejected`.
- `technicalScore`, `communicationScore`, and `reliabilityScore` must be integers from `0` to `100`.
- `notes` must be text.
- `JWT_SECRET` is required. The application does not use an unsafe default secret.

## CI/CD
GitHub Actions runs on pushes and pull requests to:
- `dev`
- `staging`
- `main`

The CI workflow:
1. Checks out the repository
2. Installs backend dependencies with `npm ci`
3. Validates the Prisma schema
4. Generates the Prisma client
5. Prepares the test environment
6. Runs the automated test suite
7. Installs frontend dependencies with `npm ci`
8. Builds the frontend

## Free-Tier Deployment Approach
This project is intended to stay within free-tier resources for the assessment.

Recommended free-tier setup:
- **Backend:** Render free tier
- **Database:** Neon free tier PostgreSQL
- **Frontend:** Vercel or Netlify free tier
- **CI/CD:** GitHub Actions
- **Monitoring, if needed:** Sentry free tier and UptimeRobot free tier

Deployment evidence included in this repository:
- `render.yaml` for Render backend deployment
- `frontend/vercel.json` for Vercel frontend deployment
- `frontend/netlify.toml` as a Netlify frontend alternative
- `DEPLOYMENT.md` with environment setup, branch mapping, and required variables
- `docs/submission-checklist.md` with submission URLs and demo recording checklist

Placeholder environment URLs to replace after service creation:

| Environment | Frontend URL | Backend API URL |
| --- | --- | --- |
| Development | `https://fresh-shifts-dev.vercel.app` | `https://fresh-shifts-api-dev.onrender.com` |
| Staging | `https://fresh-shifts-staging.vercel.app` | `https://fresh-shifts-api-staging.onrender.com` |
| Production | `https://fresh-shifts.vercel.app` | `https://fresh-shifts-api.onrender.com` |

## Environment Structure
Recommended branch-to-environment mapping:

- `dev` -> Development environment
- `staging` -> Staging environment
- `main` -> Production environment

Current repository evidence:
- Branches exist for `dev`, `staging`, and `main`.
- CI is configured for all three branches.
- Deployment configuration files are included for Render and Vercel/Netlify.
- Hosting targets still need to be connected in the selected free-tier platform dashboards.

## Known Gaps
- Deployment configuration is present, but live URLs still need to be created in Render, Neon, and Vercel/Netlify.
- Role-based access control is not implemented.

## Assumptions
1. Any authenticated user can manage candidates for this MVP.
2. API tests should not require a paid or hosted database.
3. PostgreSQL is the target database for deployed environments.
4. The frontend communicates with the backend through `VITE_API_URL`.
