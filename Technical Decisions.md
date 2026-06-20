# Technical Decisions

## Candidate Management System - Fresh Shifts

---

## 1. Why did you choose your technology stack?

### Frontend: React + Vite

React was chosen for its component-based architecture, which enables code reusability, maintainability, and scalability. The virtual DOM ensures optimal rendering performance, making it ideal for dynamic user interfaces like candidate management dashboards. Vite was selected over Create React App because it offers near-instantaneous startup times and Hot Module Replacement (HMR), significantly improving developer productivity during active development.

### Backend: Node.js + Express

Node.js provides a non-blocking, event-driven architecture that efficiently handles multiple concurrent I/O operations, making it well-suited for building REST APIs. Express was chosen for its minimalistic and flexible nature, allowing us to structure the application without unnecessary boilerplate while still providing robust routing and middleware capabilities.

### Database ORM: Prisma

Prisma provides type-safe database access, which eliminates runtime errors caused by incorrect queries. Its declarative schema definition makes migrations predictable and easy to manage. The ability to switch between SQLite (for development) and PostgreSQL (for production) ensures seamless environment transitions without code changes.

### Database: PostgreSQL on Neon

PostgreSQL is a production-grade relational database with advanced features such as JSON support, full-text search, and robust indexing. Neon's free-tier PostgreSQL offers branching capabilities, allowing us to maintain separate dev, staging, and production databases effortlessly, aligning perfectly with our Git-based environment strategy.

### Hosting: Vercel

Vercel was chosen for both frontend and backend deployment because it provides seamless GitHub integration with automatic deployments on every push. Its serverless functions support API routes, eliminating the need to manage server infrastructure. The built-in environment variable management ensures consistent configuration across all environments, and the generous free tier supports small-to-medium applications effectively.

### CI/CD: GitHub Actions

GitHub Actions integrates directly with the repository, enabling automated testing and deployment workflows. It ensures that every push triggers dependency installation, build validation, test execution, and deployment, maintaining a high standard of code quality and reducing human error.

---

## 2. How would you onboard a junior developer onto this project?

Onboarding a junior developer is not just about getting them to write code—it's about building their confidence, understanding of the system, and ensuring they feel supported.

### Week 1: Environment Setup & Orientation

**Pre-Onboarding Preparation**
- Ensure all documentation (README.md, Technical Decisions.md, .env.example) is up-to-date.
- Set up a dedicated development environment for the new developer.

**First Day: Setup & Context**
- Walk them through cloning the repository and setting up their local environment step-by-step.
- Guide them through installing dependencies, setting up the Neon database, and running migrations.
- Show them how to run the application locally (npm run dev) and verify that everything works.
- Introduce them to our core tools: VS Code, Postman, Git, and the terminal.

**Second Day: Codebase Walkthrough**
- Take a deep dive into the folder structure:
  - frontend/ - React + Vite components and pages.
  - backend/ - Express routes, controllers, and middleware.
  - prisma/ - Database schema and migrations.
  - tests/ - Automated test suites.
- Explain the architecture and data flow: frontend → API → database → response.
- Show them how to use Prisma Studio (npx prisma studio) for database inspection.

**Third Day: Shadowing & First Task**
- Pair program on a small task (e.g., adding a new dashboard metric).
- Let them drive while I guide them through the process: branching, coding, committing, and pushing.
- Review their code together and explain the reasoning behind best practices.

**Fourth Day: Independence**
- Assign a small, well-defined task (e.g., adding a new field to the candidate form).
- Let them work independently, but be available for questions.
- Schedule a follow-up meeting to review their PR together.

### Week 2: Ownership & Confidence Building

**Fifth Day: Documentation & Communication**
- Encourage them to write a short summary of what they learned.
- Introduce them to our code review process and guidelines.
- Show them how to use AI tools effectively (Claude, Cursor, ChatGPT) while still maintaining code ownership.

**Ongoing: Mentorship & Support**
- Conduct weekly 1:1 meetings to discuss progress, challenges, and career growth.
- Encourage them to explore the codebase and suggest improvements.
- Create a culture where asking questions is encouraged and mistakes are seen as learning opportunities.

---

## 3. What items would you review before approving a Pull Request?

### Code Quality
- **Readability**: Is the code clean and self-documenting? Are variables, functions, and classes named intuitively?
- **Consistency**: Does it align with the project's coding standards (Prettier, ESLint)?
- **DRY Principle**: Is there any repeated logic that should be extracted into a shared utility or hook?

### Functional Correctness
- **Requirements**: Does the PR fully address the issue or feature described?
- **Edge Cases**: Are edge cases handled (e.g., empty states, invalid inputs, network failures, authentication errors)?
- **Data Integrity**: Are database operations transactional? Are constraints validated?

### Testing
- **Test Coverage**: Does the PR include tests for new functionality? Are existing tests still passing?
- **Test Quality**: Are the tests meaningful? Do they cover happy paths and failure scenarios?

### Security
- **Input Validation**: Is all user input validated and sanitized? Are SQL injection and XSS risks mitigated?
- **Authentication/Authorization**: Are endpoints properly protected with JWT? Does the user have the correct permissions?
- **Secrets**: Are there any hardcoded secrets, API keys, or credentials?

### Performance
- **Database Queries**: Are queries optimized? Are SELECT * queries avoided? Are necessary indexes present?
- **Frontend Bundle**: Does the PR increase the bundle size? Is lazy loading implemented where appropriate?

### Documentation
- **Updated README**: Does the PR require documentation updates?
- **Code Comments**: Are complex or non-obvious sections well-commented?
- **API Documentation**: Are new endpoints documented?

### Deployment Impact
- **Migration**: Does the PR include database migrations? Are they reversible?
- **Environment Variables**: Are new environment variables documented and added to .env.example?
- **Breaking Changes**: Does the PR introduce breaking changes that require updates to other services?

---

## 4. What security risks should be considered for this application?

### 1. JWT Token Security
- **Risk**: If the JWT_SECRET is weak or exposed, an attacker can forge tokens and impersonate any user.
- **Mitigation**: Use a strong, cryptographically random secret (minimum 32 characters). Rotate secrets periodically. Never hardcode the secret or commit it to Git. Use environment variables in production (Vercel).

### 2. SQL Injection
- **Risk**: Maliciously crafted input could be used to execute arbitrary SQL queries.
- **Mitigation**: Prisma ORM automatically parameterizes queries, providing strong protection. When using prisma.$queryRaw, always sanitize inputs.

### 3. Cross-Origin Resource Sharing (CORS)
- **Risk**: Unauthorized domains could make requests to the API, leading to data theft or abuse.
- **Mitigation**: Use cors middleware to restrict allowed origins. In production, specify exact Vercel URLs.

### 4. Environment Variable Exposure
- **Risk**: .env files accidentally committed to Git could expose database credentials, JWT secrets, and API keys.
- **Mitigation**: Always include .env and .env.local in .gitignore. Use .env.example as a template. Use Vercel environment variables for production.

### 5. Password Security
- **Risk**: Storing passwords in plain text is a critical vulnerability.
- **Mitigation**: Use bcrypt to salt and hash passwords before storing them. Use a sufficiently high cost factor (10-12).

### 6. Brute Force Attacks
- **Risk**: Attackers could perform repeated login attempts to guess credentials.
- **Mitigation**: Implement rate limiting (e.g., express-rate-limit) to restrict the number of requests per IP.

### 7. XSS (Cross-Site Scripting)
- **Risk**: Malicious scripts could be injected through user input.
- **Mitigation**: Sanitize all user input. Use React's built-in XSS protection. Never use dangerouslySetInnerHTML without sanitization.

---

## 5. If given one additional week, what improvements would you implement?

### 1. Role-Based Access Control (RBAC)
Implement user roles: Admin, Recruiter, Viewer. Restrict candidate management operations based on roles. For example, only Admins can delete candidates.

### 2. Email Notifications
Automatically send email notifications when a candidate's status changes (e.g., "John has been Shortlisted"). Use services like SendGrid, Resend, or Nodemailer.

### 3. Advanced Search and Filtering
Add filters: status, date range, score ranges, keyword search. Implement sorting by name, date, and score.

### 4. Pagination
Implement server-side pagination for the candidate list to improve performance when the number of candidates grows (e.g., using skip and take with Prisma).

### 5. Audit Logs
Track who made changes and when (e.g., status changes, score updates, deletions). Store logs in a separate table (e.g., AuditLogs).

### 6. File Upload
Allow candidates to upload resumes/CVs. Use cloud storage (e.g., AWS S3, Cloudinary) and store the file URL in the database.

### 7. Performance Monitoring
Integrate Sentry for error tracking and alerting. Use APM tools (e.g., New Relic, Datadog) to monitor API latency and error rates.

### 8. Unit Tests for Frontend
Add unit tests for React components using React Testing Library. Add integration tests for API calls.

### 9. CI/CD Enhancements
Add a staging environment for testing deployments before releasing to production. Implement blue-green deployment to minimize downtime.

---

## 6. What monitoring and logging would you implement before going live?

### Monitoring Tools

| Tool | Purpose |
|------|---------|
| Sentry | Error tracking and reporting. Alerts on critical exceptions (e.g., 500 errors). |
| Logtail / Better Stack | Centralized logging for both frontend and backend. |
| Uptime Monitoring | Ping the /api/health endpoint every 5 minutes to ensure the service is up. |
| Vercel Analytics | Frontend performance monitoring (e.g., page load time, Core Web Vitals). |

### Logging Strategy

- **Backend Logs**: Use winston or pino to log requests, response times, and errors.
- **Structured Logging**: Log in JSON format for easier parsing and searching.
- **Log Levels**: Use debug, info, warn, error levels appropriately.
- **Sensitive Data**: Ensure that passwords, tokens, and PII are never logged.

### Alerts

| Condition | Threshold | Action |
|-----------|-----------|--------|
| Error Rate | >5% in 5 minutes | Alert on Slack/Email |
| API Latency | >2 seconds | Alert on Slack/Email |
| Uptime | Service down >1 minute | Alert on Slack/Email |

---

## 7. What AI tools did you use during development and how did you validate their output?

### AI Tools Used

| Tool | Purpose |
|------|---------|
| Claude | Primary tool for code generation, debugging, architectural decisions, and documentation. |
| Cursor | Used for inline code suggestions, refactoring, and code review assistance. |
| ChatGPT | Used for brainstorming alternative solutions, generating test cases, and fixing complex bugs. |

### How They Were Used

- **Claude**: Used for generating Express.js boilerplate, designing Prisma schema, fixing migration errors, and drafting technical documentation. Its ability to handle complex reasoning and provide detailed explanations made it invaluable for architecture-level decisions.
- **Cursor**: Used as an AI-powered IDE extension for inline suggestions, refactoring, and code review. It helped maintain consistency across the codebase and suggested improvements.
- **ChatGPT**: Used for brainstorming alternative approaches, 

### Validation Process

1. **Code Review**: Every AI-generated code snippet was manually reviewed line-by-line. I ensured that the logic was correct, aligned with the project's coding standards, and free of security vulnerabilities.

2. **Testing**: All code was tested locally using npm test and Postman before merging. I also performed manual testing for UI changes to ensure they met requirements.

3. **Documentation Verification**: All AI-generated documentation was cross-checked for accuracy and completeness. I verified that technical details (e.g., commands, URLs, environment variables) were correct.

4. **Understanding**: I ensured that I understood every piece of code. If something wasn't clear, I asked follow-up questions to the AI or researched further. I never committed code I didn't fully understand.

5. **Security**: I checked for security issues (e.g., hardcoded secrets, SQL injection risks, XSS vulnerabilities) in AI-generated code. I also validated that environment variables were used correctly and that authentication/authorization logic was secure.

6. **Performance**: I reviewed AI-generated database queries for performance issues (e.g., N+1 queries) and ensured that frontend bundles were optimized.

---

## ✅ End of Technical Decisions
