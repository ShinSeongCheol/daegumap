import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/src/lib/db/prisma";

export async function GET(request: NextRequest) {

    const districtBusinessStats = await prisma.districtBusinessStats.findMany();

    return NextResponse.json(
        districtBusinessStats.map(districtBusinessStat => {
            return {
                ...districtBusinessStat,
                total_count: String(districtBusinessStat.total_count)
            }
        })
    );
}