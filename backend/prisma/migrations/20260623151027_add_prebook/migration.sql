-- AlterTable
ALTER TABLE "designs" ADD COLUMN     "isPrebook" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "prebookPrice" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "prebooks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prebooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "prebooks_userId_designId_key" ON "prebooks"("userId", "designId");

-- CreateIndex
CREATE INDEX "designs_isActive_idx" ON "designs"("isActive");

-- CreateIndex
CREATE INDEX "product_categories_categoryId_idx" ON "product_categories"("categoryId");

-- CreateIndex
CREATE INDEX "products_basePrice_idx" ON "products"("basePrice");

-- CreateIndex
CREATE INDEX "products_createdAt_idx" ON "products"("createdAt");

-- AddForeignKey
ALTER TABLE "prebooks" ADD CONSTRAINT "prebooks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prebooks" ADD CONSTRAINT "prebooks_designId_fkey" FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
