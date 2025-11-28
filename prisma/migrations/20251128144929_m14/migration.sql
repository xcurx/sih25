-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('scheduled', 'completed', 'canceled');

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "status" "InterviewStatus" NOT NULL DEFAULT 'scheduled';

-- CreateTable
CREATE TABLE "Internship" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "salary" TEXT,
    "performanceReview" TEXT,

    CONSTRAINT "Internship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Internship_applicationId_key" ON "Internship"("applicationId");

-- AddForeignKey
ALTER TABLE "Internship" ADD CONSTRAINT "Internship_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
