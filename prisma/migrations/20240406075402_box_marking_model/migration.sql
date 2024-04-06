/*
  Warnings:

  - You are about to drop the column `logoUrl` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `phaseOneMarkings` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `phaseTwoMarkings` on the `Box` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Box" DROP COLUMN "logoUrl",
DROP COLUMN "phaseOneMarkings",
DROP COLUMN "phaseTwoMarkings";

-- CreateTable
CREATE TABLE "BoxMarking" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "cssTransform" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "phase" INTEGER NOT NULL,
    "boxId" TEXT,

    CONSTRAINT "BoxMarking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BoxMarking" ADD CONSTRAINT "BoxMarking_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE SET NULL ON UPDATE CASCADE;
