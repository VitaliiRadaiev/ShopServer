/*
  Warnings:

  - The primary key for the `FilterItemModel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productCardId` on the `FilterItemModel` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_FilterItemModelToProductCardModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FilterItemModelToProductCardModel_A_fkey" FOREIGN KEY ("A") REFERENCES "FilterItemModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FilterItemModelToProductCardModel_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductCardModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_UserModel" ("email", "id", "login", "password") SELECT "email", "id", "login", "password" FROM "UserModel";
DROP TABLE "UserModel";
ALTER TABLE "new_UserModel" RENAME TO "UserModel";
CREATE UNIQUE INDEX "UserModel_email_key" ON "UserModel"("email");
CREATE TABLE "new_ProductCardModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL
);
INSERT INTO "new_ProductCardModel" ("id", "title") SELECT "id", "title" FROM "ProductCardModel";
DROP TABLE "ProductCardModel";
ALTER TABLE "new_ProductCardModel" RENAME TO "ProductCardModel";
CREATE TABLE "new_FilterItemModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL
);
INSERT INTO "new_FilterItemModel" ("id", "title") SELECT "id", "title" FROM "FilterItemModel";
DROP TABLE "FilterItemModel";
ALTER TABLE "new_FilterItemModel" RENAME TO "FilterItemModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_FilterItemModelToProductCardModel_AB_unique" ON "_FilterItemModelToProductCardModel"("A", "B");

-- CreateIndex
CREATE INDEX "_FilterItemModelToProductCardModel_B_index" ON "_FilterItemModelToProductCardModel"("B");
