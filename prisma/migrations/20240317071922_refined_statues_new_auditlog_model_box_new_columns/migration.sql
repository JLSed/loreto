/*
  Warnings:

  - You are about to drop the column `item` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `mode` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `itemType` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modeOfPayment` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modifiedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `fromUserId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fromUserId_fkey";

-- AlterTable
ALTER TABLE "Box" ADD COLUMN     "placement" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "thickness" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "BoxOrder" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "outForDeliveryAt" TIMESTAMP(3),
ADD COLUMN     "paymentConfirmedAt" TIMESTAMP(3),
ADD COLUMN     "placedAt" TIMESTAMP(3),
ADD COLUMN     "processingAt" TIMESTAMP(3),
ADD COLUMN     "receivedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "item",
DROP COLUMN "mode",
DROP COLUMN "status",
ADD COLUMN     "itemType" INTEGER NOT NULL,
ADD COLUMN     "modeOfPayment" INTEGER NOT NULL,
ADD COLUMN     "modifiedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" INTEGER NOT NULL,
ALTER COLUMN "fromUserId" SET NOT NULL;

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remark" TEXT,
    "affectedTable" INTEGER NOT NULL,
    "action" INTEGER NOT NULL,
    "actorId" TEXT NOT NULL,
    "affectedRowId" TEXT NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
