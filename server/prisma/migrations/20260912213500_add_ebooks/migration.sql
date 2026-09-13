-- CreateTable
CREATE TABLE "Ebook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleHi" TEXT NOT NULL,
    "titleUr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descHi" TEXT NOT NULL,
    "descUr" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "driveUrl" TEXT NOT NULL
);
