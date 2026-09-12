-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "companyName" TEXT NOT NULL DEFAULT 'Alzakwaan Tours & Travels Pvt Ltd',
    "appName" TEXT NOT NULL DEFAULT 'Umrah Companion',
    "countdownTarget" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ContactInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "whatsapp" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "primaryEmail" TEXT NOT NULL,
    "secondaryEmail" TEXT NOT NULL,
    "offices" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameHi" TEXT NOT NULL,
    "nameUr" TEXT NOT NULL,
    "priceInr" INTEGER NOT NULL,
    "departDate" DATETIME NOT NULL,
    "nights" INTEGER NOT NULL,
    "hotelStars" TEXT NOT NULL,
    "hotelDistM" INTEGER NOT NULL,
    "cityEn" TEXT NOT NULL,
    "cityHi" TEXT NOT NULL,
    "cityUr" TEXT NOT NULL,
    "mealsEn" TEXT NOT NULL,
    "mealsHi" TEXT NOT NULL,
    "mealsUr" TEXT NOT NULL,
    "visaIncluded" BOOLEAN NOT NULL DEFAULT true,
    "flightIncluded" BOOLEAN NOT NULL DEFAULT true,
    "live" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ItineraryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packageId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "keyEn" TEXT NOT NULL,
    "keyHi" TEXT NOT NULL,
    "keyUr" TEXT NOT NULL,
    "textEn" TEXT NOT NULL,
    "textHi" TEXT NOT NULL,
    "textUr" TEXT NOT NULL,
    CONSTRAINT "ItineraryItem_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PackageInclusion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packageId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "textEn" TEXT NOT NULL,
    "textHi" TEXT NOT NULL,
    "textUr" TEXT NOT NULL,
    CONSTRAINT "PackageInclusion_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GuideRitual" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleHi" TEXT NOT NULL,
    "titleUr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descHi" TEXT NOT NULL,
    "descUr" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FirstTimeStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleHi" TEXT NOT NULL,
    "titleUr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descHi" TEXT NOT NULL,
    "descUr" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DuaStage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameHi" TEXT NOT NULL,
    "nameUr" TEXT NOT NULL,
    "noteEn" TEXT NOT NULL,
    "noteHi" TEXT NOT NULL,
    "noteUr" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Dua" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stageId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "arabic" TEXT NOT NULL,
    "transliteration" TEXT NOT NULL,
    "whenEn" TEXT NOT NULL,
    "whenHi" TEXT NOT NULL,
    "whenUr" TEXT NOT NULL,
    "meaningEn" TEXT NOT NULL,
    "meaningHi" TEXT NOT NULL,
    "meaningUr" TEXT NOT NULL,
    CONSTRAINT "Dua_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "DuaStage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PackingGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleHi" TEXT NOT NULL,
    "titleUr" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PackingItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "textEn" TEXT NOT NULL,
    "textHi" TEXT NOT NULL,
    "textUr" TEXT NOT NULL,
    CONSTRAINT "PackingItem_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "PackingGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VaccineItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameHi" TEXT NOT NULL,
    "nameUr" TEXT NOT NULL,
    "statusEn" TEXT NOT NULL,
    "statusHi" TEXT NOT NULL,
    "statusUr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descHi" TEXT NOT NULL,
    "descUr" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NewsSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "lastSyncedAt" DATETIME
);

-- CreateTable
CREATE TABLE "NewsItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "titleEn" TEXT NOT NULL,
    "titleHi" TEXT NOT NULL,
    "titleUr" TEXT NOT NULL,
    "bodyEn" TEXT NOT NULL,
    "bodyHi" TEXT NOT NULL,
    "bodyUr" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "NewsItem_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "NewsSource" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NusukLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleHi" TEXT NOT NULL,
    "titleUr" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FaqItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "questionEn" TEXT NOT NULL,
    "questionHi" TEXT NOT NULL,
    "questionUr" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "answerHi" TEXT NOT NULL,
    "answerUr" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameHi" TEXT NOT NULL,
    "nameUr" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "descHi" TEXT NOT NULL,
    "descUr" TEXT NOT NULL,
    "tags" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CustomizeEnquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "city" TEXT NOT NULL,
    "pax" INTEGER NOT NULL,
    "nights" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "hotel" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
