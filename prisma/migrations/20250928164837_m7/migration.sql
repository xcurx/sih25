-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('draft', 'active', 'closed');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('applied', 'under_review', 'shortlisted', 'rejected', 'accepted');

-- AlterTable
ALTER TABLE "public"."Opportunity" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'active';

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'applied',
    "coverLetter" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "public"."Opportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
