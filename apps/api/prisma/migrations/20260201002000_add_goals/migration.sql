-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('COUNT_TASKS_DONE', 'FINISH_DAYS');

-- CreateTable
CREATE TABLE "Goal" (
  "id" SERIAL NOT NULL,
  "userId" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "type" "GoalType" NOT NULL,
  "targetInt" INTEGER NOT NULL,
  "progressInt" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Goal_userId_isActive_idx" ON "Goal"("userId", "isActive");

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
