/*
  Warnings:

  - A unique constraint covering the columns `[commissionId]` on the table `environments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `commissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "commissions" ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subscription" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "customers" (
    "email" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "address" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE UNIQUE INDEX "environments_commissionId_key" ON "environments"("commissionId");

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("email") ON DELETE CASCADE ON UPDATE CASCADE;
