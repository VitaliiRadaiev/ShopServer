/*
  Warnings:

  - Added the required column `isMain` to the `ImageModel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ImageModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "isMain" BOOLEAN NOT NULL,
    "productCardId" TEXT NOT NULL,
    CONSTRAINT "ImageModel_productCardId_fkey" FOREIGN KEY ("productCardId") REFERENCES "ProductCardModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ImageModel" ("id", "productCardId", "url") SELECT "id", "productCardId", "url" FROM "ImageModel";
DROP TABLE "ImageModel";
ALTER TABLE "new_ImageModel" RENAME TO "ImageModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
