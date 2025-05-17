-- CreateTable
CREATE TABLE "ApartmentInquiry" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "preferredVisitationDate" TIMESTAMP(3) NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "apartmentId" TEXT NOT NULL,

    CONSTRAINT "ApartmentInquiry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApartmentInquiry" ADD CONSTRAINT "ApartmentInquiry_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
