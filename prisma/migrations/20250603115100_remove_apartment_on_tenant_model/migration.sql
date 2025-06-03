/*
  Warnings:

  - You are about to drop the column `apartmentId` on the `Tenant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_apartmentId_fkey";

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "apartmentId";
