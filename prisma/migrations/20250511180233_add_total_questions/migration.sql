/*
  Warnings:

  - Added the required column `totalQuestions` to the `TestResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestResult" ADD COLUMN "totalQuestions" INTEGER NOT NULL DEFAULT 0;

-- Update existing records
UPDATE "TestResult" SET "totalQuestions" = (
  SELECT jsonb_array_length("answers"::jsonb)
);
