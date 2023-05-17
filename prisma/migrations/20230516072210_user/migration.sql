/*
  Warnings:

  - You are about to drop the column `chatContent` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `isMine` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "chatContent",
ADD COLUMN     "isMine" BOOLEAN NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;
