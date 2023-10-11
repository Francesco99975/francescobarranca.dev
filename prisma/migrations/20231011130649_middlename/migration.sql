/*
  Warnings:

  - Made the column `firstname` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastname` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `customers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "middlename" TEXT,
ALTER COLUMN "firstname" SET NOT NULL,
ALTER COLUMN "lastname" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL;
