-- Makkah/Madinah hotel names
ALTER TABLE "Package" ADD COLUMN "makkahHotelName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Package" ADD COLUMN "madinahHotelName" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "PackageExclusion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packageId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "textEn" TEXT NOT NULL,
    "textHi" TEXT NOT NULL,
    "textUr" TEXT NOT NULL,
    CONSTRAINT "PackageExclusion_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
