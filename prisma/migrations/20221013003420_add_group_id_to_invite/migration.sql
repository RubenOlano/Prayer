/*
  Warnings:

  - You are about to drop the column `joinedAt` on the `GroupInvites` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `GroupInvites` table. All the data in the column will be lost.
  - You are about to drop the column `fname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[groupId]` on the table `GroupInvites` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "GroupInvites" DROP CONSTRAINT "GroupInvites_userId_fkey";

-- DropIndex
DROP INDEX "GroupInvites_groupId_userId_key";

-- AlterTable
ALTER TABLE "GroupInvites" DROP COLUMN "joinedAt",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fname",
DROP COLUMN "password",
ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "GroupInvites_groupId_key" ON "GroupInvites"("groupId");
