# Fresh Shifts - Candidate Management System

## Project Overview
This Candidate Management System is a full-stack web application built to streamline the hiring process. It allows HR administrators to create candidate profiles, track their status (Applied, Shortlisted, Interviewed, Selected, Rejected), evaluate them across multiple dimensions (Technical, Communication, Reliability), and view aggregate statistics in a comprehensive dashboard.

## Technology Choices
- **Frontend:** React + Vite. React offers component-based architecture for scalability, while Vite provides lightning-fast HMR and optimized builds.
- **Styling:** Tailwind CSS + Custom CSS. Tailwind enables rapid layout building. Custom CSS was used to implement a premium, dark-mode glassmorphism aesthetic that feels polished and modern.
- **Backend:** Node.js + Express.js. Express is lightweight and perfect for building fast RESTful APIs.
- **Database ORM:** Prisma. Prisma offers excellent type safety, clean migrations, and straightforward schema management.
- **Database:** SQLite (development). SQLite is lightweight and requires zero configuration for rapid local development. (Can easily switch to PostgreSQL for production).
- **Testing:** Vitest + Supertest. Vitest is extremely fast and natively supports ESM modules, making it a perfect fit for this modern Node.js stack. Supertest simplifies HTTP assertion testing.

## Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory: `cd "candidade managment system/backend"`
2. Install dependencies: `npm install`
3. Set up the environment variables: Create a `.env` file and define `PORT` and `JWT_SECRET`.
4. Initialize database: `npx prisma migrate dev`
5. Start development server: `npm run dev`

### Frontend Setup
1. Navigate to the `Candidate-Management-Frontend` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Deployment Approach
The application is designed to be deployed across separate environments reflecting a modern GitOps workflow:
- **Frontend Hosting:** Vercel or Netlify. These platforms offer seamless CI/CD integration for modern frontend frameworks out of the box.
- **Backend Hosting:** Render or Railway. These platforms support Node.js applications smoothly and allow easy connection to managed databases.
- **Database:** Supabase or Neon (for production environments replacing SQLite).

## Environment Structure
- `dev` branch -> Development Environment: Used by engineers for active feature development. 
- `staging` branch -> Staging Environment: Used for QA testing, mimicking production data and configuration.
- `main` branch -> Production Environment: The stable, customer-facing release.

## Assumptions Made
1. Authentication handles authorization. Any authenticated user can manage candidates (no granular Role-Based Access Control in MVP).
2. For testing purposes, an SQLite file database is sufficient for the development assessment.
3. The front-end service assumes the backend is running locally on port `5000` during development.
