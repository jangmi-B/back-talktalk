-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "createAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updateAt" DROP NOT NULL,
ALTER COLUMN "updateAt" SET DATA TYPE TIMESTAMP(3);
