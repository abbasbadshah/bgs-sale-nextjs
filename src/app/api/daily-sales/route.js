// app/api/daily-sales/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import DailySale from "@/models/daily-sale";

export async function GET() {
  try {
    await connectDB();
    const sales = await DailySale.find({}).sort({ date: -1 });

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

    // Validate required fields
    if (!data.products || data.products.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one product is required" },
        { status: 400 }
      );
    }

    if (!data.paymentType) {
      return NextResponse.json(
        { success: false, message: "Payment type is required" },
        { status: 400 }
      );
    }

    if (!["cash", "online"].includes(data.paymentType)) {
      return NextResponse.json(
        { success: false, message: "Invalid payment type" },
        { status: 400 }
      );
    }

    const newSale = await DailySale.create({
      date: data.date,
      products: data.products,
      totalAmount: data.totalAmount,
      paymentType: data.paymentType,
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

// Optional: Add these methods if you need to update or delete sales
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Sale ID is required" },
        { status: 400 }
      );
    }

    const updatedSale = await DailySale.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true, runValidators: true }
    );

    if (!updatedSale) {
      return NextResponse.json(
        { success: false, message: "Sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sale updated successfully",
      data: updatedSale,
    });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Sale ID is required" },
        { status: 400 }
      );
    }

    const deletedSale = await DailySale.findByIdAndDelete(id);

    if (!deletedSale) {
      return NextResponse.json(
        { success: false, message: "Sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sale deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
