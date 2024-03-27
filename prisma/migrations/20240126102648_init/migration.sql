/*
  Warnings:

  - You are about to drop the column `status` on the `ProductCardModel` table. All the data in the column will be lost.
  - Added the required column `inStock` to the `ProductCardModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isNew` to the `ProductCardModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isRecommended` to the `ProductCardModel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductCardModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "oldPrice" INTEGER NOT NULL,
    "isNew" BOOLEAN NOT NULL,
    "inStock" BOOLEAN NOT NULL,
    "isPromotion" BOOLEAN NOT NULL,
    "isBestseller" BOOLEAN NOT NULL,
    "isRecommended" BOOLEAN NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "rating" REAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "ProductCardModel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductCardModel" ("categoryId", "createdAt", "description", "id", "isBestseller", "isPromotion", "oldPrice", "price", "rating", "shortDescription", "title") SELECT "categoryId", "createdAt", "description", "id", "isBestseller", "isPromotion", "oldPrice", "price", "rating", "shortDescription", "title" FROM "ProductCardModel";
DROP TABLE "ProductCardModel";
ALTER TABLE "new_ProductCardModel" RENAME TO "ProductCardModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
