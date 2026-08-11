/*
  Warnings:

  - The `building_sub_number` column on the `commercial_area` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "commercial_area" ALTER COLUMN "standard_industrial_classification_code" DROP NOT NULL,
ALTER COLUMN "standard_industrial_classification_name" DROP NOT NULL,
ALTER COLUMN "base_lot_number" DROP NOT NULL,
ALTER COLUMN "lot_number_sub_number" DROP NOT NULL,
DROP COLUMN "building_sub_number",
ADD COLUMN     "building_sub_number" INTEGER,
ALTER COLUMN "building_management_number" DROP NOT NULL,
ALTER COLUMN "building_name" DROP NOT NULL,
ALTER COLUMN "dong_information" DROP NOT NULL,
ALTER COLUMN "floor_information" DROP NOT NULL,
ALTER COLUMN "ho_information" DROP NOT NULL;
