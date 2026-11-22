CREATE TYPE "LogWeekStatus" AS ENUM ('OPEN', 'LOCKED');

CREATE TYPE "LogEntryCategory" AS ENUM ('PROGRESS', 'BLOCKER', 'MILESTONE', 'NOTE');

CREATE TABLE "ProjectLogWeek" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "LogWeekStatus" NOT NULL DEFAULT 'OPEN',
    "lockedById" TEXT,
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectLogWeek_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectLogEntry" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "category" "LogEntryCategory" NOT NULL DEFAULT 'PROGRESS',
    "stage" "LifecycleStage" NOT NULL,
    "stepId" TEXT,
    "content" TEXT NOT NULL,
    "blockers" TEXT,
    "nextAction" TEXT,
    "attachments" TEXT[],
    "entryDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectLogEntry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProjectLogWeek_projectId_status_idx" ON "ProjectLogWeek"("projectId", "status");

CREATE UNIQUE INDEX "ProjectLogWeek_projectId_weekNumber_year_key" ON "ProjectLogWeek"("projectId", "weekNumber", "year");

CREATE INDEX "ProjectLogEntry_projectId_entryDate_idx" ON "ProjectLogEntry"("projectId", "entryDate");

CREATE INDEX "ProjectLogEntry_weekId_idx" ON "ProjectLogEntry"("weekId");

CREATE INDEX "ProjectLogEntry_stepId_idx" ON "ProjectLogEntry"("stepId");

CREATE INDEX "ProjectLogEntry_authorId_idx" ON "ProjectLogEntry"("authorId");

ALTER TABLE "ProjectLogWeek" ADD CONSTRAINT "ProjectLogWeek_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ProjectLogEntry" ADD CONSTRAINT "ProjectLogEntry_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "ProjectLogWeek"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ProjectLogEntry" ADD CONSTRAINT "ProjectLogEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ProjectLogEntry" ADD CONSTRAINT "ProjectLogEntry_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ProjectLogEntry" ADD CONSTRAINT "ProjectLogEntry_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "CommissioningStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;
