/*
  Warnings:

  - A unique constraint covering the columns `[userId,memeId]` on the table `UserLikesMeme` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('CLASSIC', 'DANK', 'WHOLESOME');

-- AlterTable
ALTER TABLE "Meme" ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'CLASSIC';

-- CreateIndex
CREATE UNIQUE INDEX "UserLikesMeme_userId_memeId_key" ON "UserLikesMeme"("userId", "memeId");
