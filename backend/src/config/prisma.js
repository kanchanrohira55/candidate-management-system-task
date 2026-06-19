const prisma =
	process.env.NODE_ENV === "test" || process.env.USE_IN_MEMORY_DB === "true"
		? (await import("./testPrisma.js")).default
		: new (await import("@prisma/client")).PrismaClient();


export default prisma;
