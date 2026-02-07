-- Add auth fields
ALTER TABLE "User" ADD COLUMN "email" TEXT;
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;

-- Drop FKs to allow type change
ALTER TABLE "Day" DROP CONSTRAINT "Day_userId_fkey";
ALTER TABLE "Task" DROP CONSTRAINT "Task_userId_fkey";
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_userId_fkey";
ALTER TABLE "Streak" DROP CONSTRAINT "Streak_userId_fkey";
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_userId_fkey";

-- Change id/userId types to TEXT
ALTER TABLE "User" ALTER COLUMN "id" TYPE TEXT USING "id"::TEXT;
ALTER TABLE "Day" ALTER COLUMN "userId" TYPE TEXT USING "userId"::TEXT;
ALTER TABLE "Task" ALTER COLUMN "userId" TYPE TEXT USING "userId"::TEXT;
ALTER TABLE "UserAchievement" ALTER COLUMN "userId" TYPE TEXT USING "userId"::TEXT;
ALTER TABLE "Streak" ALTER COLUMN "userId" TYPE TEXT USING "userId"::TEXT;
ALTER TABLE "Goal" ALTER COLUMN "userId" TYPE TEXT USING "userId"::TEXT;

-- Legacy user (only if missing)
WITH legacy_user AS (
  INSERT INTO "User" ("email", "passwordHash", "createdAt")
  VALUES ('legacy@zeroday.local', 'legacy-password-hash', NOW())
  ON CONFLICT ("email") DO NOTHING
  RETURNING "id"
),
legacy_id AS (
  SELECT "id" FROM legacy_user
  UNION ALL
  SELECT "id" FROM "User" WHERE "email" = 'legacy@zeroday.local' LIMIT 1
)
-- Backfill ownership only where userId is NULL
UPDATE "Task"
SET "userId" = (SELECT "id" FROM legacy_id LIMIT 1)
WHERE "userId" IS NULL;

UPDATE "UserAchievement"
SET "userId" = (SELECT "id" FROM legacy_id LIMIT 1)
WHERE "userId" IS NULL;

UPDATE "Streak"
SET "userId" = (SELECT "id" FROM legacy_id LIMIT 1)
WHERE "userId" IS NULL;

-- Ensure auth fields for existing users (no overrides)
UPDATE "User"
SET "email" = COALESCE("email", CONCAT('legacy+', "id", '@zeroday.local')),
    "passwordHash" = COALESCE("passwordHash", 'legacy-password-hash');

-- Enforce auth fields
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "passwordHash" SET NOT NULL;
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Recreate FKs
ALTER TABLE "Day"
ADD CONSTRAINT "Day_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Task"
ADD CONSTRAINT "Task_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserAchievement"
ADD CONSTRAINT "UserAchievement_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Streak"
ADD CONSTRAINT "Streak_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Goal"
ADD CONSTRAINT "Goal_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
