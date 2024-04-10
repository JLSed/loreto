-- CreateTable
CREATE TABLE "ImageMarking" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "src" TEXT NOT NULL,
    "transform" TEXT NOT NULL,
    "boxId" TEXT,

    CONSTRAINT "ImageMarking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImageMarking" ADD CONSTRAINT "ImageMarking_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE SET NULL ON UPDATE CASCADE;
