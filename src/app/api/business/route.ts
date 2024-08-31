import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || !user.id) {
        return NextResponse.redirect("/login");
    }

    try {
        const business = await prisma.business.findMany({
            where: {
                userId: user.id,
            },
        });

        return NextResponse.json(business);
    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: (error instanceof Error) ? error.message : 'Unknown error occurred',
            }),
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || !user.id) {
        return NextResponse.redirect("/login");
    }

    try {
        const { name, email, phone, address } = (await req.json()) as {
            name: string;
            email: string;
            phone: string;
            address: string;
        };

        if (!name || !email || !phone || !address) {
            return NextResponse.json({ message: "Name, email, phone, and address are required" }, { status: 400 });
        }

        const newBusiness = await prisma.business.create({
            data: {
                name,
                email,
                phone,
                address,
                userId: user.id,
            },
        });

        return NextResponse.json(newBusiness);
    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({
                status: "error",
                message: (error instanceof Error) ? error.message : 'Unknown error occurred',
            }),
            { status: 500 }
        );
    }
}