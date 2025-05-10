/*
  Warnings:

  - Added the required column `correctAnswers` to the `TestResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestResult" ADD COLUMN "correctAnswers" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "score" SET DATA TYPE DOUBLE PRECISION;
