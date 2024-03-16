/*
  Warnings:

  - You are about to drop the column `modifiedAt` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "modifiedAt";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
