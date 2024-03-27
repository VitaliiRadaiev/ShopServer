/*
  Warnings:

  - You are about to alter the column `rating` on the `ProductCardModel` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductCardModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "oldPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "isPromotion" BOOLEAN NOT NULL,
    "isBestseller" BOOLEAN NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "rating" REAL NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "ProductCardModel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductCardModel" ("categoryId", "createdAt", "description", "id", "isBestseller", "isPromotion", "oldPrice", "price", "rating", "shortDescription", "status", "title") SELECT "categoryId", "createdAt", "description", "id", "isBestseller", "isPromotion", "oldPrice", "price", "rating", "shortDescription", "status", "title" FROM "ProductCardModel";
DROP TABLE "ProductCardModel";
ALTER TABLE "new_ProductCardModel" RENAME TO "ProductCardModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
