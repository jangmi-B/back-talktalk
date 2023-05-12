-- CreateTable
CREATE TABLE "User" (
    "userIdx" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profileImg" TEXT,
    "isDelete" TEXT NOT NULL DEFAULT 'N',
    "createAt" DATE NOT NULL,
    "updateAt" DATE NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userIdx")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
