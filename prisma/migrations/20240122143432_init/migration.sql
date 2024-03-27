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
    CONSTRAINT "CommentModel_productCardId_fkey" FOREIGN KEY ("productCardId") REFERENCES "ProductCardModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CommentModel" ("authorId", "createdAt", "id", "liked", "productCardId", "stars", "text", "unliked") SELECT "authorId", "createdAt", "id", "liked", "productCardId", "stars", "text", "unliked" FROM "CommentModel";
DROP TABLE "CommentModel";
ALTER TABLE "new_CommentModel" RENAME TO "CommentModel";
CREATE TABLE "new_ProductFeatureModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "productCardId" TEXT NOT NULL,
    CONSTRAINT "ProductFeatureModel_productCardId_fkey" FOREIGN KEY ("productCardId") REFERENCES "ProductCardModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductFeatureModel" ("id", "productCardId", "title", "value") SELECT "id", "productCardId", "title", "value" FROM "ProductFeatureModel";
DROP TABLE "ProductFeatureModel";
ALTER TABLE "new_ProductFeatureModel" RENAME TO "ProductFeatureModel";
CREATE TABLE "new_ImageModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "productCardId" TEXT NOT NULL,
    CONSTRAINT "ImageModel_productCardId_fkey" FOREIGN KEY ("productCardId") REFERENCES "ProductCardModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ImageModel" ("id", "productCardId", "url") SELECT "id", "productCardId", "url" FROM "ImageModel";
DROP TABLE "ImageModel";
ALTER TABLE "new_ImageModel" RENAME TO "ImageModel";
CREATE TABLE "new_SubcommentModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL,
    "text" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    CONSTRAINT "SubcommentModel_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubcommentModel_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "CommentModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SubcommentModel" ("authorId", "commentId", "createdAt", "id", "text") SELECT "authorId", "commentId", "createdAt", "id", "text" FROM "SubcommentModel";
DROP TABLE "SubcommentModel";
ALTER TABLE "new_SubcommentModel" RENAME TO "SubcommentModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
