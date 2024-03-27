/*
  Warnings:

  - You are about to alter the column `A` on the `_OrderModelToProductCardModel` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `OrderModel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `OrderModel` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `OrderModel` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `stars` to the `CommentModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `OrderModel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "AdminModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CommentModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "text" TEXT NOT NULL,
    "liked" INTEGER NOT NULL,
    "unliked" INTEGER NOT NULL,
    "stars" INTEGER NOT NULL,
    "authorId" TEXT NOT NULL,
    "productCardId" TEXT NOT NULL,
    CONSTRAINT "CommentModel_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentModel_productCardId_fkey" FOREIGN KEY ("productCardId") REFERENCES "ProductCardModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CommentModel" ("authorId", "createdAt", "id", "liked", "productCardId", "text", "unliked") SELECT "authorId", "createdAt", "id", "liked", "productCardId", "text", "unliked" FROM "CommentModel";
DROP TABLE "CommentModel";
ALTER TABLE "new_CommentModel" RENAME TO "CommentModel";
CREATE TABLE "new__OrderModelToProductCardModel" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_OrderModelToProductCardModel_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_OrderModelToProductCardModel_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductCardModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__OrderModelToProductCardModel" ("A", "B") SELECT "A", "B" FROM "_OrderModelToProductCardModel";
DROP TABLE "_OrderModelToProductCardModel";
ALTER TABLE "new__OrderModelToProductCardModel" RENAME TO "_OrderModelToProductCardModel";
CREATE UNIQUE INDEX "_OrderModelToProductCardModel_AB_unique" ON "_OrderModelToProductCardModel"("A", "B");
CREATE INDEX "_OrderModelToProductCardModel_B_index" ON "_OrderModelToProductCardModel"("B");
CREATE TABLE "new_OrderModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "historyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "delivery" TEXT NOT NULL,
    "deliveryFullAddress" TEXT NOT NULL,
    "paymentTitle" TEXT NOT NULL,
    CONSTRAINT "OrderModel_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "HistoryModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderModel" ("delivery", "deliveryFullAddress", "historyId", "id", "paymentTitle", "status") SELECT "delivery", "deliveryFullAddress", "historyId", "id", "paymentTitle", "status" FROM "OrderModel";
DROP TABLE "OrderModel";
ALTER TABLE "new_OrderModel" RENAME TO "OrderModel";
CREATE UNIQUE INDEX "OrderModel_historyId_key" ON "OrderModel"("historyId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
