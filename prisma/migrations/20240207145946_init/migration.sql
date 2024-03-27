/*
  Warnings:

  - You are about to drop the `_BasketModelToProductCardModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OrderModelToProductCardModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `paymentTitle` on the `OrderModel` table. All the data in the column will be lost.
  - Added the required column `paymentMethod` to the `OrderModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `OrderModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `BasketModel` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_BasketModelToProductCardModel_B_index";

-- DropIndex
DROP INDEX "_BasketModelToProductCardModel_AB_unique";

-- DropIndex
DROP INDEX "_OrderModelToProductCardModel_B_index";

-- DropIndex
DROP INDEX "_OrderModelToProductCardModel_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_BasketModelToProductCardModel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_OrderModelToProductCardModel";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "OrderProductModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productCardId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "basketId" TEXT NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "OrderProductModel_productCardId_fkey" FOREIGN KEY ("productCardId") REFERENCES "ProductCardModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderProductModel_basketId_fkey" FOREIGN KEY ("basketId") REFERENCES "BasketModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderProductModel_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "OrderModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RecipientModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    CONSTRAINT "RecipientModel_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "OrderModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "historyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "delivery" TEXT NOT NULL,
    "deliveryFullAddress" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    CONSTRAINT "OrderModel_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "HistoryModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderModel" ("createdAt", "delivery", "deliveryFullAddress", "historyId", "id", "status") SELECT "createdAt", "delivery", "deliveryFullAddress", "historyId", "id", "status" FROM "OrderModel";
DROP TABLE "OrderModel";
ALTER TABLE "new_OrderModel" RENAME TO "OrderModel";
CREATE TABLE "new_BasketModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    CONSTRAINT "BasketModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BasketModel" ("id", "userId") SELECT "id", "userId" FROM "BasketModel";
DROP TABLE "BasketModel";
ALTER TABLE "new_BasketModel" RENAME TO "BasketModel";
CREATE UNIQUE INDEX "BasketModel_userId_key" ON "BasketModel"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "RecipientModel_orderId_key" ON "RecipientModel"("orderId");
