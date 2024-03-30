/*
  Warnings:

  - Added the required column `columnName` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "columnName" TEXT NOT NULL,
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "to" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Apartment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "monthlyRentalPrice" DOUBLE PRECISION NOT NULL,
    "maxOccupantsPerUnit" INTEGER NOT NULL,
    "images" TEXT[],
    "withMotorcycleParkingSpace" BOOLEAN NOT NULL,
    "withCarParkingSpace" BOOLEAN NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id")
);
