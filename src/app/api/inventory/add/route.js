// app/api/inventory/add/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import Inventory from "@/models/inventory";

export async function POST(request) {
  try {
    await connectDB();

    const data = await request.json();

    const newInventory = await Inventory.create({
      productName: data.productName,
      rate: data.rate,
      salingRate: data.salingRate,
      quantity: data.quantity,
    });

    return NextResponse.json(
      {
        message: "Product added successfully",
        data: newInventory,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Error adding product" },
      { status: 500 }
    );
  }
}
