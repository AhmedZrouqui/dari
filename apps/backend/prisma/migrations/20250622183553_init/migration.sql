-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "OrgRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "DocumentVisibility" AS ENUM ('INTERNAL', 'ALL_INVESTORS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" "OrgRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "description" TEXT,
    "totalBudget" DECIMAL(18,2) NOT NULL,
    "expectedCompletion" TIMESTAMP(3),
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "heroImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "equityPercentage" DOUBLE PRECISION NOT NULL,
    "investedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDING',
    "targetDate" TIMESTAMP(3),
    "order" INTEGER NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUpdate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "ProjectUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "category" TEXT NOT NULL,
    "vendor" TEXT,
    "expenseDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "invoiceId" TEXT,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "visibility" "DocumentVisibility" NOT NULL DEFAULT 'INTERNAL',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "projectUpdateId" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_ownerId_key" ON "Organization"("ownerId");

-- CreateIndex
CREATE INDEX "Membership_organizationId_idx" ON "Membership"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_organizationId_key" ON "Membership"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "Project_organizationId_idx" ON "Project"("organizationId");

-- CreateIndex
CREATE INDEX "Investment_projectId_idx" ON "Investment"("projectId");

-- CreateIndex
CREATE INDEX "Investment_userId_idx" ON "Investment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Investment_userId_projectId_key" ON "Investment"("userId", "projectId");

-- CreateIndex
CREATE INDEX "Milestone_projectId_idx" ON "Milestone"("projectId");

-- CreateIndex
CREATE INDEX "ProjectUpdate_projectId_idx" ON "ProjectUpdate"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Expense_invoiceId_key" ON "Expense"("invoiceId");

-- CreateIndex
CREATE INDEX "Expense_projectId_idx" ON "Expense"("projectId");

-- CreateIndex
CREATE INDEX "Document_projectId_idx" ON "Document"("projectId");

-- CreateIndex
CREATE INDEX "Document_projectUpdateId_idx" ON "Document"("projectUpdateId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUpdate" ADD CONSTRAINT "ProjectUpdate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUpdate" ADD CONSTRAINT "ProjectUpdate_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_projectUpdateId_fkey" FOREIGN KEY ("projectUpdateId") REFERENCES "ProjectUpdate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
