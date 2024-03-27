/*
  Warnings:

  - You are about to drop the column `login` on the `UserModel` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `ProductCardModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `ProductCardModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `ProductCardModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isBestseller` to the `ProductCardModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPromotion` to the `ProductCardModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldPrice` to the `ProductCardModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `ProductCardModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `ProductCardModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDescription` to the `ProductCardModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ProductCardModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filterBlockId` to the `FilterItemModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isIdentified` to the `UserModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `UserModel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "BasketModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    CONSTRAINT "BasketModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WishListModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    CONSTRAINT "WishListModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LastViewedProductsModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    CONSTRAINT "LastViewedProductsModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HistoryModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    CONSTRAINT "HistoryModel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "historyId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "delivery" TEXT NOT NULL,
    "deliveryFullAddress" TEXT NOT NULL,
    "paymentTitle" TEXT NOT NULL,
    CONSTRAINT "OrderModel_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "HistoryModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CategoryModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FilterBlockModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    CONSTRAINT "FilterBlockModel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductFeatureModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "productCardId" TEXT NOT NULL,
    CONSTRAINT "ProductFeatureModel_productCardId_fkey" FOREIGN KEY ("productCardId") REFERENCES "ProductCardModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ImageModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "productCardId" TEXT NOT NULL,
    CONSTRAINT "ImageModel_productCardId_fkey" FOREIGN KEY ("productCardId") REFERENCES "ProductCardModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CommentModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "text" TEXT NOT NULL,
    "liked" INTEGER NOT NULL,
    "unliked" INTEGER NOT NULL,
    "authorId" TEXT NOT NULL,
    "productCardId" TEXT NOT NULL,
    CONSTRAINT "CommentModel_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentModel_productCardId_fkey" FOREIGN KEY ("productCardId") REFERENCES "ProductCardModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubcommentModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "text" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    CONSTRAINT "SubcommentModel_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubcommentModel_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "CommentModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BasketModelToProductCardModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_BasketModelToProductCardModel_A_fkey" FOREIGN KEY ("A") REFERENCES "BasketModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BasketModelToProductCardModel_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductCardModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LastViewedProductsModelToProductCardModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_LastViewedProductsModelToProductCardModel_A_fkey" FOREIGN KEY ("A") REFERENCES "LastViewedProductsModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LastViewedProductsModelToProductCardModel_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductCardModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_OrderModelToProductCardModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_OrderModelToProductCardModel_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_OrderModelToProductCardModel_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductCardModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ProductCardModelToWishListModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ProductCardModelToWishListModel_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductCardModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProductCardModelToWishListModel_B_fkey" FOREIGN KEY ("B") REFERENCES "WishListModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "rating" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "ProductCardModel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductCardModel" ("id", "title") SELECT "id", "title" FROM "ProductCardModel";
DROP TABLE "ProductCardModel";
ALTER TABLE "new_ProductCardModel" RENAME TO "ProductCardModel";
CREATE TABLE "new_FilterItemModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filterBlockId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    CONSTRAINT "FilterItemModel_filterBlockId_fkey" FOREIGN KEY ("filterBlockId") REFERENCES "FilterBlockModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FilterItemModel" ("id", "title") SELECT "id", "title" FROM "FilterItemModel";
DROP TABLE "FilterItemModel";
ALTER TABLE "new_FilterItemModel" RENAME TO "FilterItemModel";
CREATE TABLE "new_UserModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isIdentified" BOOLEAN NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "password" TEXT,
    "phone" INTEGER NOT NULL
);
INSERT INTO "new_UserModel" ("email", "id", "password") SELECT "email", "id", "password" FROM "UserModel";
DROP TABLE "UserModel";
ALTER TABLE "new_UserModel" RENAME TO "UserModel";
CREATE UNIQUE INDEX "UserModel_email_key" ON "UserModel"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "BasketModel_userId_key" ON "BasketModel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WishListModel_userId_key" ON "WishListModel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LastViewedProductsModel_userId_key" ON "LastViewedProductsModel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HistoryModel_userId_key" ON "HistoryModel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderModel_historyId_key" ON "OrderModel"("historyId");

-- CreateIndex
CREATE UNIQUE INDEX "_BasketModelToProductCardModel_AB_unique" ON "_BasketModelToProductCardModel"("A", "B");

-- CreateIndex
CREATE INDEX "_BasketModelToProductCardModel_B_index" ON "_BasketModelToProductCardModel"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LastViewedProductsModelToProductCardModel_AB_unique" ON "_LastViewedProductsModelToProductCardModel"("A", "B");

-- CreateIndex
CREATE INDEX "_LastViewedProductsModelToProductCardModel_B_index" ON "_LastViewedProductsModelToProductCardModel"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrderModelToProductCardModel_AB_unique" ON "_OrderModelToProductCardModel"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderModelToProductCardModel_B_index" ON "_OrderModelToProductCardModel"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductCardModelToWishListModel_AB_unique" ON "_ProductCardModelToWishListModel"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductCardModelToWishListModel_B_index" ON "_ProductCardModelToWishListModel"("B");
