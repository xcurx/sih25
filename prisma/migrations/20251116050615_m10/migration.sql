-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'mentor_approval_needed';

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "mentorId" TEXT;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Faculty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
