/*
  Warnings:

  - You are about to drop the `Commercial_area` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Commercial_area";

-- CreateTable
CREATE TABLE "commercial_area" (
    "business_id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "branch_name" TEXT,
    "business_category_code" TEXT NOT NULL,
    "business_category_name" TEXT NOT NULL,
    "business_sub_category_code" TEXT NOT NULL,
    "business_sub_category_name" TEXT NOT NULL,
    "business_detail_category_code" TEXT NOT NULL,
    "business_detail_category_name" TEXT NOT NULL,
    "standard_industrial_classification_code" TEXT NOT NULL,
    "standard_industrial_classification_name" TEXT NOT NULL,
    "city_code" INTEGER NOT NULL,
    "city_name" TEXT NOT NULL,
    "district_code" INTEGER NOT NULL,
    "district_name" TEXT NOT NULL,
    "dong_code" INTEGER NOT NULL,
    "dong_name" TEXT NOT NULL,
    "legal_dong_code" INTEGER NOT NULL,
    "legal_dong_name" TEXT NOT NULL,
    "lot_number_code" INTEGER NOT NULL,
    "land_classification_code" INTEGER NOT NULL,
    "land_classification_name" TEXT NOT NULL,
    "base_lot_number" INTEGER NOT NULL,
    "lot_number_sub_number" TEXT NOT NULL,
    "lot_based_address" TEXT NOT NULL,
    "road_name_code" INTEGER NOT NULL,
    "road_name" TEXT NOT NULL,
    "building_main_lot_number" INTEGER NOT NULL,
    "building_sub_number" TEXT NOT NULL,
    "building_management_number" DOUBLE PRECISION NOT NULL,
    "building_name" TEXT NOT NULL,
    "road_name_address" TEXT NOT NULL,
    "old_postal_code" INTEGER NOT NULL,
    "new_postal_code" INTEGER NOT NULL,
    "dong_information" TEXT NOT NULL,
    "floor_information" TEXT NOT NULL,
    "ho_information" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "commercial_area_pkey" PRIMARY KEY ("business_id")
);
