/*
  Warnings:

  - You are about to drop the column `annonymous` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "annonymous",
ADD COLUMN     "anonymous" BOOLEAN NOT NULL DEFAULT false;
