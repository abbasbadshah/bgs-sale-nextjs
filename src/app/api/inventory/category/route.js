import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import ProductCategory from "@/models/add-product-category";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const newCategory = await ProductCategory.create({
      name: data.name,
    });
    return NextResponse.json(
      {
        message: "Category added successfully",
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Error adding category" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const categories = await ProductCategory.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Error fetching categories" },
      { status: 500 }
    );
  }
}
