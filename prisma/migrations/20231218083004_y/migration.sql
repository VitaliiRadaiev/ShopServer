/*
  Warnings:

  - You are about to drop the `BoardModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardImageModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ColumnModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentReadStatusModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParticipantsModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ParticipantsModelToUserModel` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `UserModel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `profilePhoto` on the `UserModel` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ParticipantsModel_boardId_key";

-- DropIndex
DROP INDEX "_ParticipantsModelToUserModel_B_index";

-- DropIndex
DROP INDEX "_ParticipantsModelToUserModel_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BoardModel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CardImageModel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CardModel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ColumnModel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CommentModel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CommentReadStatusModel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ParticipantsModel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ParticipantsModelToUserModel";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserModel" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_UserModel" ("email", "id", "login", "password") SELECT "email", "id", "login", "password" FROM "UserModel";
DROP TABLE "UserModel";
ALTER TABLE "new_UserModel" RENAME TO "UserModel";
CREATE UNIQUE INDEX "UserModel_id_key" ON "UserModel"("id");
CREATE UNIQUE INDEX "UserModel_email_key" ON "UserModel"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
