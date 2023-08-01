/*
  Warnings:

  - You are about to drop the `platforms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "platforms" DROP CONSTRAINT "platforms_skillId_fkey";

-- AlterTable
ALTER TABLE "skills" ADD COLUMN     "platform" TEXT,
ADD COLUMN     "subplatform" TEXT;

-- DropTable
DROP TABLE "platforms";
