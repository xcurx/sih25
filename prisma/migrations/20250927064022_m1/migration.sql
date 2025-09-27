/*
  Warnings:

  - Added the required column `password` to the `Employer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `PlacmentCell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Employer" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."PlacmentCell" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "password" TEXT NOT NULL;
