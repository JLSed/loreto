/*
  Warnings:

  - Added the required column `serviceFeePerHour` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "serviceFeePerHour" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "lastMaintenance" DROP NOT NULL;
