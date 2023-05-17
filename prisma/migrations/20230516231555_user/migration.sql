/*
  Warnings:

  - You are about to drop the column `userIdx` on the `ChatMember` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ChatMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChatMember" DROP CONSTRAINT "ChatMember_userIdx_fkey";

-- AlterTable
ALTER TABLE "ChatMember" DROP COLUMN "userIdx",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ChatMember" ADD CONSTRAINT "ChatMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
