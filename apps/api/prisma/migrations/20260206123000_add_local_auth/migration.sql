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

-- Keep/insert single default user
DELETE FROM "User"
WHERE "id" NOT IN (
  SELECT "id" FROM "User" ORDER BY "createdAt" ASC NULLS LAST LIMIT 1
);

INSERT INTO "User" ("id", "email", "passwordHash", "createdAt")
SELECT 'clocaluser00000000000000', 'local@example.com', 'dev-local-password-hash', NOW()
WHERE NOT EXISTS (SELECT 1 FROM "User");

UPDATE "User"
SET "id" = 'clocaluser00000000000000',
    "email" = COALESCE("email", 'local@example.com'),
    "passwordHash" = COALESCE("passwordHash", 'dev-local-password-hash');

-- Assign all existing rows to default user
UPDATE "Day" SET "userId" = 'clocaluser00000000000000';
UPDATE "Task" SET "userId" = 'clocaluser00000000000000';
UPDATE "UserAchievement" SET "userId" = 'clocaluser00000000000000';
UPDATE "Streak" SET "userId" = 'clocaluser00000000000000';
UPDATE "Goal" SET "userId" = 'clocaluser00000000000000';

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
