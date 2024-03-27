/*
  Warnings:

  - You are about to drop the column `liked` on the `CommentModel` table. All the data in the column will be lost.
  - You are about to drop the column `unliked` on the `CommentModel` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "LikeModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commentId" TEXT NOT NULL,
    CONSTRAINT "LikeModel_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "CommentModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UnlikeModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commentId" TEXT NOT NULL,
    CONSTRAINT "UnlikeModel_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "CommentModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LikeModelToUserModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_LikeModelToUserModel_A_fkey" FOREIGN KEY ("A") REFERENCES "LikeModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LikeModelToUserModel_B_fkey" FOREIGN KEY ("B") REFERENCES "UserModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_UnlikeModelToUserModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UnlikeModelToUserModel_A_fkey" FOREIGN KEY ("A") REFERENCES "UnlikeModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UnlikeModelToUserModel_B_fkey" FOREIGN KEY ("B") REFERENCES "UserModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CommentModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "text" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "authorId" TEXT NOT NULL,
    "productCardId" TEXT NOT NULL,
    CONSTRAINT "CommentModel_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentModel_productCardId_fkey" FOREIGN KEY ("productCardId") REFERENCES "ProductCardModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CommentModel" ("authorId", "createdAt", "id", "productCardId", "stars", "text") SELECT "authorId", "createdAt", "id", "productCardId", "stars", "text" FROM "CommentModel";
DROP TABLE "CommentModel";
ALTER TABLE "new_CommentModel" RENAME TO "CommentModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "LikeModel_commentId_key" ON "LikeModel"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "UnlikeModel_commentId_key" ON "UnlikeModel"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "_LikeModelToUserModel_AB_unique" ON "_LikeModelToUserModel"("A", "B");

-- CreateIndex
CREATE INDEX "_LikeModelToUserModel_B_index" ON "_LikeModelToUserModel"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UnlikeModelToUserModel_AB_unique" ON "_UnlikeModelToUserModel"("A", "B");

-- CreateIndex
CREATE INDEX "_UnlikeModelToUserModel_B_index" ON "_UnlikeModelToUserModel"("B");
