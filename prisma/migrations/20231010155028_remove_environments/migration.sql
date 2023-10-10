/*
  Warnings:

  - You are about to drop the `environments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `environment` to the `commissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "environments" DROP CONSTRAINT "environments_commissionId_fkey";

-- AlterTable
ALTER TABLE "commissions" ADD COLUMN     "environment" TEXT NOT NULL;

-- DropTable
DROP TABLE "environments";
