'use server';

import Papa from "papaparse";
import {CommercialArea} from "@/src/features/business/types";
import {prisma} from "@/src/lib/db/prisma";

type BusinessCsvRow = {
    상가업소번호: string,
    상호명: string,
    지점명: string,
    상권업종대분류코드: string,
    상권업종대분류명: string,
    상권업종중분류코드: string,
    상권업종중분류명: string,
    상권업종소분류코드: string,
    상권업종소분류명: string,
    표준산업분류코드: string,
    표준산업분류명: string,
    시도코드: number,
    시도명: string,
    시군구코드: number,
    시군구명: string,
    행정동코드: number,
    행정동명: string,
    법정동코드: number,
    법정동명: string,
    지번코드: number,
    대지구분코드: number,
    대지구분명: string,
    지번본번지: number,
    지번부번지: string,
    지번주소: string,
    도로명코드: number,
    도로명: string,
    건물본번지: number,
    건물부번지: number,
    건물관리번호: number,
    건물명: string,
    도로명주소: string,
    구우편번호: number,
    신우편번호: number,
    동정보: string,
    층정보: string,
    호정보: string,
    경도: number,
    위도: number
}

export async function parseCsv(formData: FormData) {
    const file = formData.get('file') as File | null;

    if (!file) {
        throw new Error('파일이 없습니다.');
    }

    const text = await file.text();

    const parse = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
    });

    if (parse.errors.length > 0) {
        throw new Error('CSV 파싱 실패.');
    }

    const records = parse.data as Array<BusinessCsvRow>
    const commercialAreas: CommercialArea[] =  records.map((record) => {
        return {
            business_id: record.상가업소번호,
            business_name: record.상호명,
            branch_name: record.지점명,
            business_category_code: record.상권업종대분류코드,
            business_category_name: record.상권업종대분류명,
            business_sub_category_code: record.상권업종중분류코드,
            business_sub_category_name: record.상권업종중분류명,
            business_detail_category_code: record.상권업종소분류코드,
            business_detail_category_name: record.상권업종소분류명,
            standard_industrial_classification_code: record.표준산업분류코드,
            standard_industrial_classification_name: record.표준산업분류명,
            city_code: parseInt(String(record.시도코드)),
            city_name: record.시도명,
            district_code: parseInt(String(record.시군구코드)),
            district_name: record.시군구명,
            dong_code: parseInt(String(record.행정동코드)),
            dong_name:  record.행정동명,
            legal_dong_code: BigInt(String(record.법정동코드)),
            legal_dong_name: record.법정동명,
            lot_number_code: BigInt(String(record.지번코드)),
            land_classification_code: parseInt(String(record.대지구분코드)),
            land_classification_name: record.대지구분명,
            base_lot_number: parseInt(String(record.지번본번지)),
            lot_number_sub_number: record.지번부번지,
            lot_based_address: record.지번주소,
            road_name_code: BigInt(String(record.도로명코드)),
            road_name: record.도로명,
            building_main_lot_number: parseInt(String(record.건물본번지)),
            building_sub_number: parseInt(String(record.건물부번지)),
            building_management_number: parseFloat(String(record.건물관리번호)),
            building_name: record.건물명,
            road_name_address: record.도로명주소,
            old_postal_code: parseInt(String(record.구우편번호)),
            new_postal_code: parseInt(String(record.신우편번호)),
            dong_information: record.동정보,
            floor_information: record.층정보,
            ho_information: record.호정보,
            longitude: parseFloat(String(record.경도)),
            latitude: parseFloat(String(record.위도))
        }
    });

    return commercialAreas;
}

export async function uploadBusiness(commercialArea: CommercialArea) {

    await prisma.commercialArea.create({
        data: {
            business_id: commercialArea.business_id,
            business_name: commercialArea.business_name,
            branch_name: commercialArea.branch_name,
            business_category_code: commercialArea.business_category_code,
            business_category_name: commercialArea.business_category_name,
            business_sub_category_code: commercialArea.business_sub_category_code,
            business_sub_category_name: commercialArea.business_sub_category_name,
            business_detail_category_code: commercialArea.business_detail_category_code,
            business_detail_category_name: commercialArea.business_detail_category_name,
            standard_industrial_classification_code: commercialArea.standard_industrial_classification_code,
            standard_industrial_classification_name: commercialArea.standard_industrial_classification_name,
            city_code: parseInt(String(commercialArea.city_code)),
            city_name: commercialArea.city_name,
            district_code: parseInt(String(commercialArea.district_code)),
            district_name: commercialArea.district_name,
            dong_code: parseInt(String(commercialArea.dong_code)),
            dong_name: commercialArea.dong_name,
            legal_dong_code: BigInt(String(commercialArea.legal_dong_code)),
            legal_dong_name: commercialArea.legal_dong_name,
            lot_number_code: BigInt(String(commercialArea.lot_number_code)),
            land_classification_code: parseInt(String(commercialArea.land_classification_code)),
            land_classification_name: commercialArea.land_classification_name,
            base_lot_number: parseInt(String(commercialArea.base_lot_number)),
            lot_number_sub_number: commercialArea.lot_number_sub_number,
            lot_based_address: commercialArea.lot_based_address,
            road_name_code: BigInt(String(commercialArea.road_name_code)),
            road_name: commercialArea.road_name,
            building_main_lot_number: parseInt(String(commercialArea.building_main_lot_number)),
            building_sub_number: parseInt(String(commercialArea.building_sub_number)),
            building_management_number: parseFloat(String(commercialArea.building_management_number)),
            building_name: commercialArea.building_name,
            road_name_address: commercialArea.road_name_address,
            old_postal_code: parseInt(String(commercialArea.old_postal_code)),
            new_postal_code: parseInt(String(commercialArea.new_postal_code)),
            dong_information: commercialArea.dong_information,
            floor_information: commercialArea.floor_information,
            ho_information: commercialArea.ho_information,
            longitude: parseFloat(String(commercialArea.longitude)),
            latitude: parseFloat(String(commercialArea.latitude)),
        }
    });
}

export async function uploadBusinessChunk(commercialAreas: CommercialArea[]) {
    const res = await prisma.commercialArea.createMany({
        data:commercialAreas,
        skipDuplicates: true,
    })
    return res.count;
}

export async function refreshStatisticView() {
    await prisma.$executeRawUnsafe('REFRESH MATERIALIZED VIEW city_business_stats');
    await prisma.$executeRawUnsafe('REFRESH MATERIALIZED VIEW district_business_stats');
    await prisma.$executeRawUnsafe('REFRESH MATERIALIZED VIEW legal_dong_business_stats');
}