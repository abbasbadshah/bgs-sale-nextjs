// app/api/auth/logout/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = cookies();
    cookieStore.delete("token");

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error during logout" },
      { status: 500 }
    );
  }
}
