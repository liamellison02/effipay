import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 🚀 Fix: Ensure it's not statically generated

export async function POST(req: Request) {
  try {
    console.log("📢 Register API hit");

    const { email, password } = await req.json();
    console.log("📌 Received Data:", { email, password });

    if (!email || !password) {
      console.log("❌ Missing fields");
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectToDatabase();
    console.log("✅ Connected to MongoDB");

    const existingUser = await User.findOne({ email });
    console.log("🔍 Checking existing user:", existingUser);

    if (existingUser) {
      console.log("❌ User already exists");
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Hashed Password:", hashedPassword);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    console.log("✅ User created successfully!");
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("❌ Register API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
