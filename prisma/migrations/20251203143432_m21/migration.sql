/*
  Warnings:

  - A unique constraint covering the columns `[internshipId]` on the table `Certificate` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "internshipId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_internshipId_key" ON "Certificate"("internshipId");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internship"("id") ON DELETE SET NULL ON UPDATE CASCADE;
