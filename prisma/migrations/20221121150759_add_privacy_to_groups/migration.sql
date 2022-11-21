/*
  Warnings:

  - Made the column `private` on table `Group` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "private" SET NOT NULL,
ALTER COLUMN "private" SET DEFAULT true;
