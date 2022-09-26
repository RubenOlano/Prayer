/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fname" TEXT,
    "lname" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "password" TEXT NOT NULL,
    "image" TEXT
);
INSERT INTO "new_User" ("email", "emailVerified", "fname", "id", "image", "lname") SELECT "email", "emailVerified", "fname", "id", "image", "lname" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
