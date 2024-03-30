/*
  Warnings:

  - Added the required column `bedrooms` to the `Apartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toiletAndBath` to the `Apartment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "bedrooms" INTEGER NOT NULL,
ADD COLUMN     "toiletAndBath" INTEGER NOT NULL;
