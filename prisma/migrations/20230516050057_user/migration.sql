/*
  Warnings:

  - Added the required column `userIdx` to the `ChatMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatMember" ADD COLUMN     "userIdx" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ChatMember" ADD CONSTRAINT "ChatMember_userIdx_fkey" FOREIGN KEY ("userIdx") REFERENCES "User"("userIdx") ON DELETE RESTRICT ON UPDATE CASCADE;
