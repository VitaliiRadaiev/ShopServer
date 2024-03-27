/*
  Warnings:

  - Added the required column `userId` to the `OrderModel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "historyId" TEXT,
    "createdAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "delivery" TEXT NOT NULL,
    "deliveryFullAddress" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "OrderModel_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "HistoryModel" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OrderModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderModel" ("createdAt", "delivery", "deliveryFullAddress", "historyId", "id", "paymentMethod", "status", "totalPrice") SELECT "createdAt", "delivery", "deliveryFullAddress", "historyId", "id", "paymentMethod", "status", "totalPrice" FROM "OrderModel";
DROP TABLE "OrderModel";
ALTER TABLE "new_OrderModel" RENAME TO "OrderModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
