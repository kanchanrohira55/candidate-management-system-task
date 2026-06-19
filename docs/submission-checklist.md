# Submission Checklist

Use this checklist before sending the Fresh Shifts assessment.

## Repository
- [ ] GitHub repository URL: `https://github.com/<username>/fresh-shifts-candidate-management`
- [ ] Branches exist: `dev`, `staging`, `main`
- [ ] Pull request or merge evidence exists for dev -> staging -> main
- [ ] CI passes on the submission branch

## Environment URLs
Replace placeholders after Vercel projects are created.

| Environment | App URL | API Health URL | Database |
| --- | --- | --- | --- |
| Development | `https://fresh-shifts-dev.vercel.app` | `https://fresh-shifts-dev.vercel.app/api/health` | Neon dev branch |
| Staging | `https://fresh-shifts-staging.vercel.app` | `https://fresh-shifts-staging.vercel.app/api/health` | Neon staging branch |
| Production | `https://fresh-shifts.vercel.app` | `https://fresh-shifts.vercel.app/api/health` | Neon production database |

## Platform Setup
- [ ] Neon PostgreSQL database or branch created for `dev`
- [ ] Neon PostgreSQL database or branch created for `staging`
- [ ] Neon PostgreSQL database or branch created for `main`
- [ ] Vercel project created for `dev`
- [ ] Vercel project created for `staging`
- [ ] Vercel project created for `main`

## Environment Variables
- [ ] Vercel `DATABASE_URL` set from matching Neon connection string
- [ ] Vercel `JWT_SECRET` set with a strong generated value
- [ ] Vercel `FRONTEND_URL` set to matching Vercel app URL
- [ ] Optional `VITE_API_URL` omitted for same-domain `/api`, or set to matching app URL plus `/api`

## Demo Recording
- [ ] Show repository branches: `dev`, `staging`, `main`
- [ ] Show CI workflow passing
- [ ] Show deployed Vercel app URL
- [ ] Show `/api/health`
- [ ] Register or log in
- [ ] Create candidate profile
- [ ] View candidate list
- [ ] View candidate details
- [ ] Update status
- [ ] Add interview notes
- [ ] Add technical, communication, and reliability scores
- [ ] Show dashboard metrics
- [ ] Explain free-tier deployment approach
- [ ] Explain key technical decisions and AI usage
