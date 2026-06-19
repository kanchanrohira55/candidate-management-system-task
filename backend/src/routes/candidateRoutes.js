import express from "express";
import {
	getCandidates,
	getCandidate,
	createCandidate,
	updateCandidate,
	deleteCandidate,
	getDashboard,
} from "../controllers/candidateController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticate);

router.get("/dashboard", getDashboard);
router.get("/", getCandidates);
router.get("/:id", getCandidate);
router.post("/", createCandidate);
router.put("/:id", updateCandidate);
router.delete("/:id", deleteCandidate);

export default router;
