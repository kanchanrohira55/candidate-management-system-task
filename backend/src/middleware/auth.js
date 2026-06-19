import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/security.js";

export const authenticate = (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			return res.status(401).json({ error: "Authentication required" });
		}

		const decoded = jwt.verify(token, getJwtSecret());
		req.userId = decoded.userId;
		next();
	} catch (error) {
		return res.status(401).json({ error: "Invalid token" });
	}
};
