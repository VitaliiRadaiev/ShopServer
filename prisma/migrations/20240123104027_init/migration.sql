-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isIdentified" BOOLEAN NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "password" TEXT,
    "phone" TEXT
);
INSERT INTO "new_UserModel" ("email", "firstName", "id", "isIdentified", "lastName", "password", "phone") SELECT "email", "firstName", "id", "isIdentified", "lastName", "password", "phone" FROM "UserModel";
DROP TABLE "UserModel";
ALTER TABLE "new_UserModel" RENAME TO "UserModel";
CREATE UNIQUE INDEX "UserModel_email_key" ON "UserModel"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
