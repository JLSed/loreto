/*
  Warnings:

  - You are about to drop the column `length` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `phase` on the `BoxMarking` table. All the data in the column will be lost.
  - Added the required column `dragTransform` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leftPanelSize` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rightPanelSize` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWidth` to the `Box` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Box" DROP COLUMN "length",
DROP COLUMN "width",
ADD COLUMN     "dragTransform" TEXT NOT NULL,
ADD COLUMN     "leftPanelSize" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rightPanelSize" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalWidth" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "BoxMarking" DROP COLUMN "phase",
ADD COLUMN     "isUnderlined" BOOLEAN NOT NULL DEFAULT false;
