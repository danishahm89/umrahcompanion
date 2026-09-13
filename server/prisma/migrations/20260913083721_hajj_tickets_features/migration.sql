-- AlterTable
ALTER TABLE "Package" ADD COLUMN "hajjShifting" BOOLEAN;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN "formType" TEXT;

-- CreateTable
CREATE TABLE "TicketEnquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "fromPlace" TEXT NOT NULL,
    "toPlace" TEXT NOT NULL,
    "travelDate" DATETIME NOT NULL,
    "returnDate" DATETIME,
    "passengers" INTEGER NOT NULL,
    "classPref" TEXT NOT NULL,
    "tatkal" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
