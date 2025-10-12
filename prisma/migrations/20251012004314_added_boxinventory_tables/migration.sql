-- CreateTable
CREATE TABLE "BoxInventory" (
    "id" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "thickness" INTEGER NOT NULL DEFAULT 0,
    "color" INTEGER NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL,
    "weightPerPiece" INTEGER NOT NULL,
    "TotalWeight" INTEGER NOT NULL,
    "cardboardType" INTEGER NOT NULL DEFAULT 0,
    "boxType" INTEGER NOT NULL,

    CONSTRAINT "BoxInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoxType" (
    "id" SERIAL NOT NULL,
    "typeName" TEXT NOT NULL,

    CONSTRAINT "BoxType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BoxInventory" ADD CONSTRAINT "BoxInventory_boxType_fkey" FOREIGN KEY ("boxType") REFERENCES "BoxType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
