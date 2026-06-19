# Technical Decisions

### Why did you choose your technology stack?
The current repository uses **React, Vite, Node.js, Express, Prisma, PostgreSQL, Vitest, and Supertest**.

- **React with Vite** was chosen for a small, fast frontend that can be deployed on free-tier static hosting.
- **Node.js with Express** was chosen because it is lightweight, familiar, and well suited for building REST APIs quickly.
- **Prisma** was chosen to keep database access structured and maintainable instead of writing raw SQL throughout controllers.
- **PostgreSQL** was chosen as the target database because it is production-ready and available through free-tier providers such as Neon.
- **Render, Neon, and Vercel/Netlify** were selected for deployment planning because their free tiers are enough for an assessment-sized application.
- **Vitest** was chosen because the project uses ECMAScript modules and Vitest supports this cleanly with minimal configuration.
- **Supertest** was chosen for API-level integration testing without needing a running external server.

### How would you onboard a junior developer onto this project?
1. **Local setup:** Have them clone the repository, install backend dependencies, copy `.env.example`, and run the test suite.
2. **Architecture overview:** Walk through the request flow: React UI -> REST API -> Express routes -> authentication middleware -> controllers -> Prisma or test adapter -> database.
3. **First task:** Assign a small vertical task, such as adding a candidate field across the form, API validation, schema, and tests.
4. **Testing habit:** Require them to run backend tests and frontend build before opening a pull request.
5. **CI review:** Show them the GitHub Actions workflow so they understand how automated validation protects the branches.

### What items would you review before approving a Pull Request?
- **Functionality:** Does the change satisfy the requirement without breaking existing API behavior?
- **Validation:** Are request bodies validated before writing to the database?
- **Security:** Are protected routes behind JWT authentication? Are secrets read from environment variables instead of defaults?
- **Error handling:** Are expected user/data errors returned as `400` or `404` instead of generic `500` responses?
- **Testing:** Are meaningful tests added or updated, and does CI pass?
- **Frontend quality:** Does the UI support the core workflow without hiding validation or API errors?
- **Maintainability:** Does the change follow the existing route/controller/config structure?
- **Documentation:** If behavior or setup changed, were README and technical notes updated?

### What security risks should be considered for this application?
1. **Weak authentication configuration:** `JWT_SECRET` must be required in every non-test environment. This has been addressed by removing the unsafe fallback secret.
2. **Brute-force login attempts:** The login endpoint should add rate limiting before production deployment.
3. **Authorization gaps:** The MVP allows any authenticated user to manage all candidates. Role-based access control should be added if different HR roles exist.
4. **Input validation:** Candidate status, score ranges, email format, and notes type must be validated before database writes. This is now enforced in the API.
5. **XSS risk in notes:** Notes are stored as text. Any future frontend must render notes safely and avoid unsafe HTML injection.
6. **CORS policy:** CORS should be restricted to approved frontend origins in deployed environments.

### If given one additional week, what improvements would you implement?
- **Deployment:** Create live Render, Neon, and Vercel/Netlify environments using the included deployment configs.
- **Database hardening:** Add more domain-level constraints as the product grows, such as separate interview note records.
- **Security hardening:** Tune rate limit thresholds from real usage data and add account lockout/alerting if needed.
- **Pagination and filtering:** Add candidate pagination, filtering by status, and sorting by score or created date.
- **Role-based access control:** Add admin/interviewer permissions for sensitive actions such as delete.

### What monitoring and logging would you implement before going live?
- **Structured logging:** Add a logger such as Pino or Winston for request and error logs.
- **Error tracking:** Use Sentry free tier for backend error reporting.
- **Uptime monitoring:** Use UptimeRobot free tier against `/api/health`.
- **Platform logs:** Use Render logs for backend runtime visibility.
- **Database observability:** Use Neon dashboard metrics for connection and query health.

### What AI tools did you use during development and how did you validate their output?
- **AI tools used:** LLM coding assistants in the development environment.
- **Usage:** Repository audit, test/CI fixes, validation hardening, and documentation updates.
- **Validation:** Changes were checked against repository evidence, reviewed through diffs, and verified with automated tests. The current backend test suite passes locally with 23 tests.
