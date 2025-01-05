// app/api/auth/login/route.js
import { connectDB } from "@/utils/db";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = "your_super_secret_key_123!@#$%^&*()_+";

export async function POST(req) {
  try {
    const body = await req.json();
    const { login, password } = body; // 'login' can be either email or username

    if (!login || !password) {
      return NextResponse.json(
        { message: "Login credentials and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Try to find user by email or username
    const user = await User.findOne({
      $or: [{ email: login }, { username: login }],
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const cookieStore = cookies();
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    });

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          email: user.email,
          username: user.username,
          id: user._id,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Error during login", error: error.message },
      { status: 500 }
    );
  }
}