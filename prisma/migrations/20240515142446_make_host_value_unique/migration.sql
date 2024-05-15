/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `Host` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Host_value_key" ON "Host"("value");
