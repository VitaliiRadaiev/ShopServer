-- CreateTable
CREATE TABLE "ProductCardModel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FilterItemModel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "productCardId" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "FilterItemModel_productCardId_fkey" FOREIGN KEY ("productCardId") REFERENCES "ProductCardModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductCardModel_id_key" ON "ProductCardModel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FilterItemModel_id_key" ON "FilterItemModel"("id");
