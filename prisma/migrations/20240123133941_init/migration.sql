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
    CONSTRAINT "ProductCardModel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductCardModel" ("categoryId", "createdAt", "description", "id", "isBestseller", "isPromotion", "oldPrice", "price", "rating", "shortDescription", "status", "title") SELECT "categoryId", "createdAt", "description", "id", "isBestseller", "isPromotion", "oldPrice", "price", "rating", "shortDescription", "status", "title" FROM "ProductCardModel";
DROP TABLE "ProductCardModel";
ALTER TABLE "new_ProductCardModel" RENAME TO "ProductCardModel";
CREATE TABLE "new_FilterBlockModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    CONSTRAINT "FilterBlockModel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FilterBlockModel" ("categoryId", "id", "title") SELECT "categoryId", "id", "title" FROM "FilterBlockModel";
DROP TABLE "FilterBlockModel";
ALTER TABLE "new_FilterBlockModel" RENAME TO "FilterBlockModel";
CREATE TABLE "new_FilterItemModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filterBlockId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    CONSTRAINT "FilterItemModel_filterBlockId_fkey" FOREIGN KEY ("filterBlockId") REFERENCES "FilterBlockModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FilterItemModel" ("filterBlockId", "id", "title") SELECT "filterBlockId", "id", "title" FROM "FilterItemModel";
DROP TABLE "FilterItemModel";
ALTER TABLE "new_FilterItemModel" RENAME TO "FilterItemModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
