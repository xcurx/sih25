/*
  Warnings:

  - Added the required column `opportunityId` to the `Internship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Internship" ADD COLUMN     "opportunityId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Internship" ADD CONSTRAINT "Internship_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
