import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import OnlineSale from "@/models/online-sale";

export async function GET() {
  try {
    await connectDB();
    const sales = await OnlineSale.find({}).sort({ date: -1 });

    return NextResponse.json({
      success: true,
      data: sales,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data.products || data.products.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one product is required" },
        { status: 400 }
      );
    }

    const newSale = await OnlineSale.create({
      date: data.date,
      products: data.products,
      totalAmount: data.totalAmount,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Sale recorded successfully",
        data: newSale,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
