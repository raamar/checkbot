/*
  Warnings:

  - Added the required column `https` to the `Check` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Check` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Check" ADD COLUMN     "https" BOOLEAN NOT NULL,
ADD COLUMN     "time" INTEGER NOT NULL;
