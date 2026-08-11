import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/src/lib/db/prisma";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const commercials = await prisma.commercialArea.findMany();

    return NextResponse.json(commercials);
}