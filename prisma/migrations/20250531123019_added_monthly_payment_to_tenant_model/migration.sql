/*
  Warnings:

  - Added the required column `monthlyPayment` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "monthlyPayment" DOUBLE PRECISION NOT NULL;
