/*
  Warnings:

  - You are about to drop the column `userId` on the `Favorite` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "repoId" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Favorite" ("createdAt", "id", "repoId", "repoName", "repoUrl") SELECT "createdAt", "id", "repoId", "repoName", "repoUrl" FROM "Favorite";
DROP TABLE "Favorite";
ALTER TABLE "new_Favorite" RENAME TO "Favorite";
CREATE UNIQUE INDEX "Favorite_user_id_repoId_key" ON "Favorite"("user_id", "repoId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
