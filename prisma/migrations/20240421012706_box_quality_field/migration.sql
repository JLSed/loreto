/*
  Warnings:

  - Added the required column `quality` to the `Box` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Box" ADD COLUMN     "quality" TEXT NOT NULL;
