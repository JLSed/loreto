-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "agreementCreated" TIMESTAMP(3),
ADD COLUMN     "contractSigned" TIMESTAMP(3),
ADD COLUMN     "ownerName" TEXT,
ADD COLUMN     "ownerSignature" TEXT,
ADD COLUMN     "tenantSignature" TEXT,
ADD COLUMN     "witnesses" TEXT[];
