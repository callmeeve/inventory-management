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
        const products = await prisma.product.findMany({
            where: {
                business: {
                    userId: user.id,
                },
            },
            include: {
                business: true,
                categories: true,
            },
        });

        return NextResponse.json(products);
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
        const business = await prisma.business.findFirst({
            where: {
                userId: user.id,
            }
        });

        if (!business) {
            return new NextResponse(
                JSON.stringify({
                    status: "error",
                    message: "Business not found",
                }),
                { status: 404 }
            );
        }

        const data = await req.json();
        
        const { name, price, quantity, categoryId } = data;

        if (!name || typeof name !== 'string' || !price || typeof price !== 'number' || !quantity || typeof quantity !== 'number') {
            return NextResponse.json({ message: "Name, price, and quantity are required and must be valid types" }, { status: 400 });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                price,
                quantity,
                businessId: business.id,
                categoryId: categoryId || null,
            },
        });

        return NextResponse.json(newProduct);
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