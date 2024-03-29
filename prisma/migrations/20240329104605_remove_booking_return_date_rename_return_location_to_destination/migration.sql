/*
  Warnings:

  - You are about to drop the column `returnLocation` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "returnLocation",
ADD COLUMN     "destination" TEXT,
ALTER COLUMN "returnDate" DROP NOT NULL;
