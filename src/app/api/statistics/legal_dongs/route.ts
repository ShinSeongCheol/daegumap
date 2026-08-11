import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/src/lib/db/prisma";

export async function GET(request: NextRequest) {
    const legalDongBusinessStats = await prisma.legalDongBusinessStats.findMany();
    return NextResponse.json(
        legalDongBusinessStats.map(legalDongBusinessStat => {
            return {
                ...legalDongBusinessStat,
                total_count: String(legalDongBusinessStat.total_count)
            }
        })
    );
}