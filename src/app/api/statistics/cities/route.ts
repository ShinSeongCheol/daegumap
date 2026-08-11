import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/src/lib/db/prisma";

export async function GET(request: NextRequest) {

    const cityBusinessStats = await prisma.cityBusinessStats.findMany();

    return NextResponse.json(
        cityBusinessStats.map(cityBusinessStat => {
            return {
                ...cityBusinessStat,
                total_count: String(cityBusinessStat.total_count)
            }
        })
    );
}