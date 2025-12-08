-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "MatchedStudent" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "MatchedStudent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchedStudent_studentId_opportunityId_key" ON "MatchedStudent"("studentId", "opportunityId");

-- AddForeignKey
ALTER TABLE "MatchedStudent" ADD CONSTRAINT "MatchedStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchedStudent" ADD CONSTRAINT "MatchedStudent_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
