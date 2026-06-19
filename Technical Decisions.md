# Technical Decisions

### Why did you choose your technology stack?
I chose **React, Node.js, Express, and Prisma** because this stack provides a perfect balance of development speed, ecosystem maturity, and performance. 
- **React** allows for modular component architecture and rapid UI iterations. 
- **Node.js with Express** offers a lightweight and unopinionated backend that scales well for I/O heavy operations like database querying and serving JSON APIs.
- **Prisma** is a modern ORM that ensures type-safety. It drastically reduces runtime errors related to database queries compared to traditional string-based SQL queries or older ORMs like Sequelize.
- **Vitest** was selected over Jest for testing because it natively supports ECMAScript modules without complex Babel configuration, making it the fastest and most seamless choice for a modern Node/Vite stack.

### How would you onboard a junior developer onto this project?
1. **Local Setup & Access:** Ensure they have access to the repository, Node.js, and a code editor. Walk them through the `README.md` setup instructions.
2. **Architecture Overview:** Explain the data flow: from React frontend components -> Axios API calls -> Express routes -> Controllers -> Prisma ORM -> Database.
3. **Pair Programming:** Start them on a small, contained task (e.g., adding a new field to the Candidate model, like "LinkedIn URL"). Pair program through the schema change, route update, and frontend form to give them a complete vertical slice.
4. **Codebase Conventions:** Introduce them to our testing standards, CI/CD pipeline, and PR process.

### What items would you review before approving a Pull Request?
- **Functionality:** Does the code solve the problem or fulfill the feature requirement effectively?
- **Security:** Are new endpoints protected by the `authenticate` middleware? Is user input validated/sanitized to prevent injection attacks?
- **Testing:** Are there adequate unit/integration tests for the new code? Did the CI pipeline pass successfully?
- **Code Quality:** Is the code clean, readable, and properly modularized? Are variables meaningfully named? Are there unnecessary `console.log`s?
- **Design:** Does the frontend code adhere to the established premium UI aesthetic (glassmorphism, tailwind standards)?

### What security risks should be considered for this application?
1. **Broken Authentication/Authorization:** Relying solely on client-side routing protection. All candidate API routes must enforce JWT verification (which was fixed in this implementation).
2. **Data Exposure:** Returning sensitive data (like password hashes) in API responses. The API should strictly filter payload responses.
3. **Cross-Site Scripting (XSS):** If interview notes allow HTML, malicious scripts could be injected. React automatically escapes strings, but caution must be taken if `dangerouslySetInnerHTML` is ever used.
4. **Rate Limiting:** Without rate-limiting, the `/login` endpoint is vulnerable to brute-force password guessing.

### If given one additional week, what improvements would you implement?
- **Role-Based Access Control (RBAC):** Differentiating between "Admin" (can delete candidates) and "Interviewer" (can only add scores/notes).
- **Advanced Filtering and Sorting:** Adding backend pagination, filtering by status, and sorting by score.
- **File Uploads:** Implementing cloud storage integration (like AWS S3) to allow uploading candidate resumes.
- **Automated Email Notifications:** Integrating SendGrid or AWS SES to notify candidates when their status changes.

### What monitoring and logging would you implement before going live?
- **Application Performance Monitoring (APM):** Integrating New Relic or Datadog to monitor API latency, database query bottlenecks, and memory usage.
- **Centralized Logging:** Using tools like Winston or Pino in Node.js to stream structured JSON logs to services like Papertrail or ELK Stack for easier debugging.
- **Error Tracking:** Setting up Sentry on both the React frontend and Node backend to capture unhandled exceptions, alerting the team instantly.
- **Uptime Monitoring:** Pingdom or Better Uptime to monitor the `/api/health` endpoint and alert engineers if the service goes down.

### What AI tools did you use during development and how did you validate their output?
- **AI Assistants used:** LLM Assistants integrated into the coding environment.
- **Usage:** Brainstorming modern UI color palettes, generating boilerplate test structures, and validating CI/CD YAML syntax.
- **Validation:** Every piece of AI-generated code was manually reviewed for context accuracy, tested locally by running the application, and verified automatically through the Vitest testing suite. I ensure that no opaque "black box" code is committed without understanding the exact execution flow.
