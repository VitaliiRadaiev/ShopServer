-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderProductModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productCardId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "basketId" TEXT,
    "orderId" INTEGER,
    CONSTRAINT "OrderProductModel_productCardId_fkey" FOREIGN KEY ("productCardId") REFERENCES "ProductCardModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderProductModel_basketId_fkey" FOREIGN KEY ("basketId") REFERENCES "BasketModel" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OrderProductModel_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "OrderModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrderProductModel" ("basketId", "count", "id", "orderId", "productCardId") SELECT "basketId", "count", "id", "orderId", "productCardId" FROM "OrderProductModel";
DROP TABLE "OrderProductModel";
ALTER TABLE "new_OrderProductModel" RENAME TO "OrderProductModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
