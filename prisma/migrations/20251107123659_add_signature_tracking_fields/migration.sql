-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "adminSigned" BOOLEAN DEFAULT false,
ADD COLUMN     "adminSignedAt" TIMESTAMP(3),
ADD COLUMN     "tenantSigned" BOOLEAN DEFAULT false,
ADD COLUMN     "tenantSignedAt" TIMESTAMP(3);
