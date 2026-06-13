-- AlterTable
ALTER TABLE "designs" ADD COLUMN     "imageBack" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "imageModel" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "imageUrl" SET DEFAULT '';
