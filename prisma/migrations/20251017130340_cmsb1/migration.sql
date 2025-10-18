-- CreateEnum
CREATE TYPE "OwnershipType" AS ENUM ('OWNED', 'RENTED');

-- CreateEnum
CREATE TYPE "ResidentStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PENDING', 'OVERDUE');

-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('EKUB', 'EDDIR');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'TELEBIRR', 'CHAPA', 'IN_APP');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('CLEANING', 'SECURITY', 'GARBAGE');

-- CreateEnum
CREATE TYPE "UtilityType" AS ENUM ('ELECTRICITY', 'WATER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('OPEN', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ComplaintCategory" AS ENUM ('WATER', 'ELECTRICITY', 'SECURITY', 'MAINTENANCE', 'THEFT', 'OTHER');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');

-- CreateEnum
CREATE TYPE "AudienceType" AS ENUM ('ALL', 'BLOCK', 'GROUP');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('ADMIN', 'RESIDENT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ANNOUNCEMENT', 'PAYMENT_REMINDER', 'COMPLAINT_UPDATE', 'SYSTEM_ALERT');

-- CreateTable
CREATE TABLE "residents" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "block" TEXT NOT NULL,
    "house_no" TEXT NOT NULL,
    "ownership_type" "OwnershipType" NOT NULL,
    "owner_name" TEXT,
    "family_members" INTEGER NOT NULL,
    "car_plate" TEXT,
    "date_registered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ResidentStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by" TEXT,
    "condominium_id" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,

    CONSTRAINT "residents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parking_slots" (
    "id" TEXT NOT NULL,
    "slot_no" TEXT NOT NULL,
    "car_owner_id" TEXT,
    "car_plate" TEXT,
    "is_reserved" BOOLEAN NOT NULL,
    "fee_monthly" DECIMAL(65,30) NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL,
    "date_paid" TIMESTAMP(3),

    CONSTRAINT "parking_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ekub_eddir" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "GroupType" NOT NULL,
    "admin_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monthly_contribution" DECIMAL(65,30) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,

    CONSTRAINT "ekub_eddir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ekub_eddir_members" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "join_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "ekub_eddir_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ekub_eddir_payments" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT NOT NULL,
    "round_no" INTEGER,

    CONSTRAINT "ekub_eddir_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "service_type" "ServiceType" NOT NULL,
    "contact" TEXT NOT NULL,
    "fee_monthly" DECIMAL(65,30) NOT NULL,
    "rating" DOUBLE PRECISION,

    CONSTRAINT "service_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_payments" (
    "id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "resident_id" TEXT NOT NULL,
    "month" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL,
    "payment_date" TIMESTAMP(3),

    CONSTRAINT "service_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilities" (
    "id" TEXT NOT NULL,
    "resident_id" TEXT NOT NULL,
    "meter_no" TEXT NOT NULL,
    "service_type" "UtilityType" NOT NULL,
    "current_reading" INTEGER NOT NULL,
    "previous_reading" INTEGER NOT NULL,
    "usage" INTEGER NOT NULL,
    "billing_amount" DECIMAL(65,30) NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL,
    "report_issue" TEXT,
    "report_status" "ReportStatus",
    "provider" TEXT NOT NULL,

    CONSTRAINT "utilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaints" (
    "id" TEXT NOT NULL,
    "resident_id" TEXT NOT NULL,
    "category" "ComplaintCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "photo" TEXT,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'OPEN',
    "assigned_admin" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "target_audience" "AudienceType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL,
    "assigned_condominium" TEXT,
    "password_hash" TEXT NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condominiums" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "total_blocks" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_by" TEXT,

    CONSTRAINT "condominiums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "actor_type" "ActorType" NOT NULL,
    "action" TEXT NOT NULL,
    "target_table" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "residents_phone_key" ON "residents"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "admins_phone_key" ON "admins"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- AddForeignKey
ALTER TABLE "residents" ADD CONSTRAINT "residents_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residents" ADD CONSTRAINT "residents_condominium_id_fkey" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parking_slots" ADD CONSTRAINT "parking_slots_car_owner_id_fkey" FOREIGN KEY ("car_owner_id") REFERENCES "residents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ekub_eddir" ADD CONSTRAINT "ekub_eddir_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "residents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ekub_eddir_members" ADD CONSTRAINT "ekub_eddir_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "ekub_eddir"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ekub_eddir_members" ADD CONSTRAINT "ekub_eddir_members_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "residents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ekub_eddir_payments" ADD CONSTRAINT "ekub_eddir_payments_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "residents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ekub_eddir_payments" ADD CONSTRAINT "ekub_eddir_payments_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "ekub_eddir"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_payments" ADD CONSTRAINT "service_payments_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "service_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_payments" ADD CONSTRAINT "service_payments_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "utilities" ADD CONSTRAINT "utilities_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_assigned_admin_fkey" FOREIGN KEY ("assigned_admin") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominiums" ADD CONSTRAINT "condominiums_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "residents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
