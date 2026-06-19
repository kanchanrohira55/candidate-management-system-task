-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected');

-- AlterTable
ALTER TABLE "Candidate"
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "CandidateStatus" USING "status"::"CandidateStatus",
ALTER COLUMN "status" SET DEFAULT 'Applied';

-- CreateIndex
CREATE INDEX "Candidate_status_idx" ON "Candidate"("status");

-- CreateIndex
CREATE INDEX "Candidate_createdAt_idx" ON "Candidate"("createdAt");
