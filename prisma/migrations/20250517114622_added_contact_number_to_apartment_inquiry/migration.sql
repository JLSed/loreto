/*
  Warnings:

  - Added the required column `contactNumber` to the `ApartmentInquiry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApartmentInquiry" ADD COLUMN     "contactNumber" TEXT NOT NULL;
