// app/api/auth/register/route.js
import { connectDB } from "@/utils/db";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, username, password, confirmPassword, role } = await req.json();

    await connectDB();
    
    // Check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // Check for existing username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      confirmPassword: confirmPassword,
      role: role || "user",
    });

    const userWithoutPassword = {
      email: user.email,
      username: user.username,
      _id: user._id,
      role: user.role,
      confirmPassword: user.confirmPassword,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { message: "User created successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Error creating user", error: error.message },
      { status: 500 }
    );
  }
}