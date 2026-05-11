-- AddColumn
ALTER TABLE "Process" ADD COLUMN "executionType" TEXT;

-- CreateIndex
CREATE INDEX "Process_areaId_idx" ON "Process"("areaId");

-- CreateIndex
CREATE INDEX "Process_parentId_idx" ON "Process"("parentId");
