/*
  Warnings:

  - You are about to drop the `LikeModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnlikeModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LikeModelToUserModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UnlikeModelToUserModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `authorId` on the `SubcommentModel` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "LikeModel_commentId_key";

-- DropIndex
DROP INDEX "UnlikeModel_commentId_key";

-- DropIndex
DROP INDEX "_LikeModelToUserModel_B_index";

-- DropIndex
DROP INDEX "_LikeModelToUserModel_AB_unique";

-- DropIndex
DROP INDEX "_UnlikeModelToUserModel_B_index";

-- DropIndex
DROP INDEX "_UnlikeModelToUserModel_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LikeModel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UnlikeModel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_LikeModelToUserModel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UnlikeModelToUserModel";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "LikesModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commentId" TEXT NOT NULL,
    CONSTRAINT "LikesModel_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "CommentModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DislikesModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commentId" TEXT NOT NULL,
    CONSTRAINT "DislikesModel_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "CommentModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LikesModelToUserModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_LikesModelToUserModel_A_fkey" FOREIGN KEY ("A") REFERENCES "LikesModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LikesModelToUserModel_B_fkey" FOREIGN KEY ("B") REFERENCES "UserModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DislikesModelToUserModel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DislikesModelToUserModel_A_fkey" FOREIGN KEY ("A") REFERENCES "DislikesModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DislikesModelToUserModel_B_fkey" FOREIGN KEY ("B") REFERENCES "UserModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SubcommentModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "text" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    CONSTRAINT "SubcommentModel_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "CommentModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SubcommentModel" ("commentId", "createdAt", "id", "text") SELECT "commentId", "createdAt", "id", "text" FROM "SubcommentModel";
DROP TABLE "SubcommentModel";
ALTER TABLE "new_SubcommentModel" RENAME TO "SubcommentModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "LikesModel_commentId_key" ON "LikesModel"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "DislikesModel_commentId_key" ON "DislikesModel"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "_LikesModelToUserModel_AB_unique" ON "_LikesModelToUserModel"("A", "B");

-- CreateIndex
CREATE INDEX "_LikesModelToUserModel_B_index" ON "_LikesModelToUserModel"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DislikesModelToUserModel_AB_unique" ON "_DislikesModelToUserModel"("A", "B");

-- CreateIndex
CREATE INDEX "_DislikesModelToUserModel_B_index" ON "_DislikesModelToUserModel"("B");
