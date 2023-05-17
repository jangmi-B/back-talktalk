-- CreateTable
CREATE TABLE "ChatRoom" (
    "roomIdx" SERIAL NOT NULL,
    "roomTitle" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("roomIdx")
);

-- CreateTable
CREATE TABLE "ChatMember" (
    "memberIdx" SERIAL NOT NULL,
    "roomIdx" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMember_pkey" PRIMARY KEY ("memberIdx")
);

-- CreateTable
CREATE TABLE "Chat" (
    "chatIdx" SERIAL NOT NULL,
    "roomIdx" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "chatContent" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("chatIdx")
);

-- AddForeignKey
ALTER TABLE "ChatMember" ADD CONSTRAINT "ChatMember_roomIdx_fkey" FOREIGN KEY ("roomIdx") REFERENCES "ChatRoom"("roomIdx") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_roomIdx_fkey" FOREIGN KEY ("roomIdx") REFERENCES "ChatRoom"("roomIdx") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
