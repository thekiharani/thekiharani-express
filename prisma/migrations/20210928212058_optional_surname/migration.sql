/*
  Warnings:

  - You are about to drop the column `emailVerifiedAt` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "emailVerifiedAt";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "surname" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL;
