/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `ProjectsOnSkills` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `ProjectsOnSkills` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectsOnSkills" DROP COLUMN "assignedAt",
DROP COLUMN "assignedBy";
