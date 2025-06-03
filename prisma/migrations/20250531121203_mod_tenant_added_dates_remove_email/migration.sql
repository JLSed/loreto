/*
  Warnings:

  - You are about to drop the column `email` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `startingDate` on the `Tenant` table. All the data in the column will be lost.
  - Added the required column `monthlyDueDate` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moveInDate` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "email",
DROP COLUMN "startingDate",
ADD COLUMN     "monthlyDueDate" INTEGER NOT NULL,
ADD COLUMN     "moveInDate" TIMESTAMP(3) NOT NULL;
