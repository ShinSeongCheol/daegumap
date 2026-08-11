import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/src/lib/db/prisma";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const minLng = parseFloat(String(searchParams.get('minLng')));
    const minLat = parseFloat(String(searchParams.get('minLat')));
    const maxLng = parseFloat(String(searchParams.get('maxLng')));
    const maxLat = parseFloat(String(searchParams.get('maxLat')));

    const commercialAreaList = await prisma.commercialArea.findMany({
        where: {
            longitude: {
                gte: minLng,
                lte: maxLng
            },
            latitude: {
                gte: minLat,
                lte: maxLat
            }
        }
    });

    return NextResponse.json(commercialAreaList.map(commercialArea => {
        return {
            business_id: commercialArea.business_id,
            business_name: commercialArea.business_name,
            branch_name: commercialArea.branch_name,
            business_category_name: commercialArea.business_category_name,
            business_sub_category_name: commercialArea.business_sub_category_name,
            business_detail_category_name: commercialArea.business_detail_category_name,
            longitude: commercialArea.longitude,
            latitude: commercialArea.latitude
        }
    }))
}