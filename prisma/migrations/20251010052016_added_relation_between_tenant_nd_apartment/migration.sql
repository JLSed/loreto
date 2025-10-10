-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN     "tenantId" INTEGER;

-- AddForeignKey
ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
