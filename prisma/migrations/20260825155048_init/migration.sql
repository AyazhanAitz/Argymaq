-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'MANAGER');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NEW', 'ACCEPTED', 'CONSULTATION_SCHEDULED', 'IN_SUPPORT', 'REFERRED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "StoryStatus" AS ENUM ('FUNDRAISING_OPEN', 'IN_PROGRESS', 'HELP_PROVIDED', 'REPORT_PUBLISHED');

-- CreateEnum
CREATE TYPE "FundraiserStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "VacancyFormat" AS ENUM ('OFFICE', 'REMOTE', 'HYBRID');

-- CreateEnum
CREATE TYPE "GrantStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('PROJECT', 'FLEA_MARKET', 'ECO', 'KIDS');

-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('NEWS', 'ANNOUNCEMENT', 'EVENT', 'PROMO', 'REPORT', 'GRANT', 'VACANCY');

-- CreateEnum
CREATE TYPE "GalleryCategory" AS ENUM ('PROJECTS', 'MOTHERS', 'CHILDREN', 'VOLUNTEERS', 'EVENTS', 'FLEA_MARKET', 'ECO');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'MANAGER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "childrenCount" INTEGER,
    "childrenAges" TEXT,
    "situationDescription" TEXT NOT NULL,
    "helpCategories" TEXT[],
    "documentPaths" TEXT[],
    "preferredContactTime" TEXT,
    "consentPersonalData" BOOLEAN NOT NULL DEFAULT false,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NEW',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleKz" TEXT NOT NULL,
    "summaryRu" TEXT NOT NULL,
    "summaryKz" TEXT NOT NULL,
    "problemRu" TEXT NOT NULL,
    "problemKz" TEXT NOT NULL,
    "neededHelpRu" TEXT NOT NULL,
    "neededHelpKz" TEXT NOT NULL,
    "goalOfWeekRu" TEXT,
    "goalOfWeekKz" TEXT,
    "resultRu" TEXT,
    "resultKz" TEXT,
    "reportRu" TEXT,
    "reportKz" TEXT,
    "categoryTags" TEXT[],
    "status" "StoryStatus" NOT NULL DEFAULT 'FUNDRAISING_OPEN',
    "isMamaOfWeek" BOOLEAN NOT NULL DEFAULT false,
    "weekOf" TIMESTAMP(3),
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "anonymized" BOOLEAN NOT NULL DEFAULT true,
    "coverImage" TEXT,
    "images" TEXT[],
    "resultImages" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fundraiser" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleKz" TEXT NOT NULL,
    "descriptionRu" TEXT NOT NULL,
    "descriptionKz" TEXT NOT NULL,
    "goalAmount" INTEGER NOT NULL,
    "raisedAmount" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "FundraiserStatus" NOT NULL DEFAULT 'OPEN',
    "coverImage" TEXT,
    "storyId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fundraiser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "fundraiserId" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleKz" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vacancy" (
    "id" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleKz" TEXT NOT NULL,
    "organization" TEXT,
    "city" TEXT NOT NULL,
    "format" "VacancyFormat" NOT NULL DEFAULT 'OFFICE',
    "schedule" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "salaryFrom" INTEGER,
    "salaryTo" INTEGER,
    "descriptionRu" TEXT NOT NULL,
    "descriptionKz" TEXT NOT NULL,
    "requirementsRu" TEXT,
    "requirementsKz" TEXT,
    "contactInfo" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vacancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grant" (
    "id" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleKz" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "forWhomRu" TEXT NOT NULL,
    "forWhomKz" TEXT NOT NULL,
    "fundingAmount" TEXT NOT NULL,
    "requirementsRu" TEXT NOT NULL,
    "requirementsKz" TEXT NOT NULL,
    "deadline" TIMESTAMP(3),
    "documentsNeededRu" TEXT,
    "documentsNeededKz" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "status" "GrantStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Grant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "ProjectCategory" NOT NULL DEFAULT 'PROJECT',
    "titleRu" TEXT NOT NULL,
    "titleKz" TEXT NOT NULL,
    "descriptionRu" TEXT NOT NULL,
    "descriptionKz" TEXT NOT NULL,
    "goalRu" TEXT,
    "goalKz" TEXT,
    "resultsRu" TEXT,
    "resultsKz" TEXT,
    "partners" TEXT[],
    "coverImage" TEXT,
    "images" TEXT[],
    "reportRu" TEXT,
    "reportKz" TEXT,
    "eventDate" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleKz" TEXT NOT NULL,
    "descriptionRu" TEXT NOT NULL,
    "descriptionKz" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "location" TEXT NOT NULL,
    "organizer" TEXT,
    "registrationUrl" TEXT,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "NewsCategory" NOT NULL DEFAULT 'NEWS',
    "titleRu" TEXT NOT NULL,
    "titleKz" TEXT NOT NULL,
    "excerptRu" TEXT NOT NULL,
    "excerptKz" TEXT NOT NULL,
    "bodyRu" TEXT NOT NULL,
    "bodyKz" TEXT NOT NULL,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VolunteerApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "city" TEXT,
    "specializations" TEXT[],
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VolunteerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerApplication" (
    "id" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "cooperationTypes" TEXT[],
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsefulArticle" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleRu" TEXT NOT NULL,
    "titleKz" TEXT NOT NULL,
    "summaryRu" TEXT NOT NULL,
    "summaryKz" TEXT NOT NULL,
    "bodyRu" TEXT NOT NULL,
    "bodyKz" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsefulArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" "GalleryCategory" NOT NULL,
    "captionRu" TEXT,
    "captionKz" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteStat" (
    "key" TEXT NOT NULL,
    "labelRu" TEXT NOT NULL,
    "labelKz" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "suffix" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteStat_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AdminAuditLog_entity_entityId_idx" ON "AdminAuditLog"("entity", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_ticketNumber_key" ON "Application"("ticketNumber");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Application_createdAt_idx" ON "Application"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");

-- CreateIndex
CREATE INDEX "Story_status_idx" ON "Story"("status");

-- CreateIndex
CREATE INDEX "Story_isMamaOfWeek_idx" ON "Story"("isMamaOfWeek");

-- CreateIndex
CREATE INDEX "Story_published_idx" ON "Story"("published");

-- CreateIndex
CREATE UNIQUE INDEX "Fundraiser_slug_key" ON "Fundraiser"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Fundraiser_storyId_key" ON "Fundraiser"("storyId");

-- CreateIndex
CREATE INDEX "Fundraiser_status_idx" ON "Fundraiser"("status");

-- CreateIndex
CREATE INDEX "Vacancy_active_idx" ON "Vacancy"("active");

-- CreateIndex
CREATE INDEX "Grant_status_idx" ON "Grant"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_category_idx" ON "Project"("category");

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "Event"("date");

-- CreateIndex
CREATE UNIQUE INDEX "NewsPost_slug_key" ON "NewsPost"("slug");

-- CreateIndex
CREATE INDEX "NewsPost_category_idx" ON "NewsPost"("category");

-- CreateIndex
CREATE INDEX "NewsPost_publishedAt_idx" ON "NewsPost"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UsefulArticle_slug_key" ON "UsefulArticle"("slug");

-- CreateIndex
CREATE INDEX "GalleryImage_category_idx" ON "GalleryImage"("category");

-- AddForeignKey
ALTER TABLE "AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundraiser" ADD CONSTRAINT "Fundraiser_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_fundraiserId_fkey" FOREIGN KEY ("fundraiserId") REFERENCES "Fundraiser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
