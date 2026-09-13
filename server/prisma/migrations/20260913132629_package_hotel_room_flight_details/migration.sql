-- AlterTable: room-sharing prices (nullable; priceInr stays as the auto-computed "from" price)
ALTER TABLE "Package" ADD COLUMN "price2Share" INTEGER;
ALTER TABLE "Package" ADD COLUMN "price3Share" INTEGER;
ALTER TABLE "Package" ADD COLUMN "price4Share" INTEGER;
ALTER TABLE "Package" ADD COLUMN "price5Share" INTEGER;

-- AlterTable: split hotel into Makkah + Madinah, each with stars/distance/remark
ALTER TABLE "Package" ADD COLUMN "makkahHotelStars" INTEGER NOT NULL DEFAULT 3;
ALTER TABLE "Package" ADD COLUMN "makkahHotelDistM" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Package" ADD COLUMN "makkahHotelRemark" TEXT NOT NULL DEFAULT 'walking';
ALTER TABLE "Package" ADD COLUMN "madinahHotelStars" INTEGER NOT NULL DEFAULT 3;
ALTER TABLE "Package" ADD COLUMN "madinahHotelDistM" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Package" ADD COLUMN "madinahHotelRemark" TEXT NOT NULL DEFAULT 'walking';

-- AlterTable: flight plan
ALTER TABLE "Package" ADD COLUMN "flightConfirmLater" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Package" ADD COLUMN "flightAirline" TEXT;
ALTER TABLE "Package" ADD COLUMN "flightRouting" TEXT;
ALTER TABLE "Package" ADD COLUMN "flightViaCity" TEXT;
ALTER TABLE "Package" ADD COLUMN "flightDepartureAt" DATETIME;
ALTER TABLE "Package" ADD COLUMN "flightReturnAt" DATETIME;

-- Backfill from the old single hotelStars/hotelDistM columns before dropping them.
-- hotelStars was free text like "3★" — strip the star glyph and whitespace, same value applied
-- to both cities since packages previously only tracked one hotel figure.
UPDATE "Package" SET
  "makkahHotelStars" = COALESCE(NULLIF(CAST(REPLACE(REPLACE("hotelStars", '★', ''), ' ', '') AS INTEGER), 0), 3),
  "madinahHotelStars" = COALESCE(NULLIF(CAST(REPLACE(REPLACE("hotelStars", '★', ''), ' ', '') AS INTEGER), 0), 3),
  "makkahHotelDistM" = "hotelDistM",
  "madinahHotelDistM" = "hotelDistM";

-- Backfill price2Share from the old flat priceInr — the app previously documented all prices as
-- "per person on twin sharing", so the historical priceInr represents the 2-share tier.
UPDATE "Package" SET "price2Share" = "priceInr";

ALTER TABLE "Package" DROP COLUMN "hotelStars";
ALTER TABLE "Package" DROP COLUMN "hotelDistM";
