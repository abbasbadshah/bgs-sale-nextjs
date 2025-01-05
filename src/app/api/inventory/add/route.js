import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import Inventory from "@/models/inventory";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const newInventory = await Inventory.create({
      productName: data.productName,
      category: data.category,
      rate: data.rate,
      salingRate: data.salingRate,
      regularBulkRate: data.regularBulkRate,
      bulkQuantityRate: data.bulkQuantityRate,
      quantity: data.quantity,
    });
    const populatedInventory = await Inventory.findById(
      newInventory._id
    ).populate({
      path: "category",
      select: "name",
    });

    console.log("Populated Inventory:", populatedInventory);

    return NextResponse.json(
      {
        message: "Product added successfully",
        data: populatedInventory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json(
      { message: error.message || "Error adding product" },
      { status: 500 }
    );
  }
}
