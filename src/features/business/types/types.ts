export interface city_business_statistic {
    city_code: number,
    city_name: string,
    total_count: number,
    longitude: number,
    latitude: number,
}

export interface district_business_statistic extends city_business_statistic {
    district_code: number,
    district_name: string,
}

export interface legal_dong_business_statistic extends district_business_statistic {
    legal_dong_code: number,
    legal_dong_name: string,
}