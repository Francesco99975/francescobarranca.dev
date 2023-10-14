/*
  Warnings:

  - You are about to drop the column `accepted` on the `commissions` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `commissions` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SUBMITTED', 'PENDING', 'ACCEPTED', 'INVOICING', 'COMPLETED');

-- AlterTable
ALTER TABLE "commissions" DROP COLUMN "accepted",
DROP COLUMN "completed",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'SUBMITTED';
