import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user.id) {
    return NextResponse.redirect("/login");
  }

  try {
    const business = await prisma.business.findUnique({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!business) {
      return NextResponse.json({ message: "Business not found" }, { status: 404 });
    }

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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const updatedBusiness = await prisma.business.update({
      where: {
        id: params.id,
        userId: user.id,
      },
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    return NextResponse.json(updatedBusiness);
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !user.id) {
    return NextResponse.redirect("/login");
  }

  try {
    await prisma.business.delete({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "Business deleted successfully" });
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