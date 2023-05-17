/*
  Warnings:

  - You are about to drop the column `userId` on the `ChatMember` table. All the data in the column will be lost.
  - Added the required column `userIdx` to the `ChatMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChatMember" DROP CONSTRAINT "ChatMember_userId_fkey";

-- AlterTable
ALTER TABLE "ChatMember" DROP COLUMN "userId",
ADD COLUMN     "userIdx" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ChatMember" ADD CONSTRAINT "ChatMember_userIdx_fkey" FOREIGN KEY ("userIdx") REFERENCES "User"("userIdx") ON DELETE RESTRICT ON UPDATE CASCADE;
