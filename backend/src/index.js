import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

if (process.env.VERCEL_URL) {
	allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

app.use(
	cors({
		origin(origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			return callback(new Error("Not allowed by CORS"));
		},
	}),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);

// Health check
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", message: "Server is running" });
});

// Export app for testing
export default app;

// Only start server outside tests and serverless deployments
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
	app.listen(PORT, () => {
		console.log(`🚀 Server running on http://localhost:${PORT}`);
	});
}
