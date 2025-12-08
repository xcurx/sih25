-- CreateEnum
CREATE TYPE "CompanyRequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "CompanyRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT,
    "industry" TEXT,
    "type" TEXT,
    "location" TEXT,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "message" TEXT,
    "status" "CompanyRequestStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,
    "reviewerId" TEXT,

    CONSTRAINT "CompanyRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyRequest" ADD CONSTRAINT "CompanyRequest_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "PlacmentCell"("id") ON DELETE SET NULL ON UPDATE CASCADE;
