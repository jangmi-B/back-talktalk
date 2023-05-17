/*
  Warnings:

  - You are about to drop the column `userId` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `userIdx` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "userId",
ADD COLUMN     "userIdx" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userIdx_fkey" FOREIGN KEY ("userIdx") REFERENCES "User"("userIdx") ON DELETE RESTRICT ON UPDATE CASCADE;
