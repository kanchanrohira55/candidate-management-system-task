# Submission Checklist

Use this checklist before sending the Fresh Shifts assessment.

## Repository
- [ ] GitHub repository URL: `https://github.com/<username>/candidate-management-system`
- [ ] Branches exist: `dev`, `staging`, `main`
- [ ] Pull request or merge evidence exists for dev -> staging -> main
- [ ] CI passes on the submission branch

## Environment URLs
Replace placeholders after services are created.

| Environment | Frontend URL | Backend API URL | Database |
| --- | --- | --- | --- |
| Development | `https://fresh-shifts-dev.vercel.app` | `https://fresh-shifts-api-dev.onrender.com` | Neon dev branch |
| Staging | `https://fresh-shifts-staging.vercel.app` | `https://fresh-shifts-api-staging.onrender.com` | Neon staging branch |
| Production | `https://fresh-shifts.vercel.app` | `https://fresh-shifts-api.onrender.com` | Neon main database |

## Platform Setup
- [ ] Render backend service created for `dev`
- [ ] Render backend service created for `staging`
- [ ] Render backend service created for `main`
- [ ] Neon PostgreSQL database or branch created for `dev`
- [ ] Neon PostgreSQL database or branch created for `staging`
- [ ] Neon PostgreSQL database or branch created for `main`
- [ ] Vercel or Netlify frontend created for `dev`
- [ ] Vercel or Netlify frontend created for `staging`
- [ ] Vercel or Netlify frontend created for `main`

## Environment Variables
- [ ] Render `DATABASE_URL` set from Neon
- [ ] Render `JWT_SECRET` set with a strong generated value
- [ ] Render `FRONTEND_URL` set to the matching frontend URL
- [ ] Frontend `VITE_API_URL` set to the matching Render API URL plus `/api`

## Demo Recording
- [ ] Show repository branches: `dev`, `staging`, `main`
- [ ] Show CI workflow passing
- [ ] Show deployed frontend URL
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
