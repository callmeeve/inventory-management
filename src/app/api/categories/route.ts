import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const categories = await prisma.category.findMany();

        return NextResponse.json(categories);
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
    try {
        const data = await req.json();
        const { name } = data;

        if (!name) {
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: "Name is required",
                }),
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name,
            },
        });

        return NextResponse.json(category);
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