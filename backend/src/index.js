import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "../src/routes/authRoutes.js";
import candidateRoutes from "../src/routes/candidateRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);

// Health check
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", message: "Server is running" });
});

// Export for Vercel
export default app;
