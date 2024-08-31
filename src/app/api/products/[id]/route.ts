import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || !user.id) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    try {
        const id = params.id;

        if (!id) {
            return NextResponse.json({ status: "error", message: "Product ID is required" }, { status: 400 });
        }

        const business = await prisma.business.findFirst({
            where: { userId: user.id },
        });

        if (!business) {
            return NextResponse.json({ status: "error", message: "Business not found" }, { status: 404 });
        }

        const product = await prisma.product.findFirst({
            where: {
                id: id,
                businessId: business.id,
            }
        });

        if (!product) {
            return NextResponse.json({ status: "error", message: "Product not found" }, { status: 404 });
        }

        await prisma.product.delete({
            where: { id: id },
        });

        return NextResponse.json({ status: "success", message: "Product deleted successfully" }, { status: 200 });

    } catch (error: unknown) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            {
                status: "error",
                message: error instanceof Error ? error.message : 'An unknown error occurred'
            },
            { status: 500 }
        );
    }
}