import { NextResponse } from "next/server";
import { signInWithEmail } from "@/lib/actions/auth.actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await signInWithEmail({ email, password });
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error ?? "Unable to sign in" },
        { status: result.error?.toLowerCase().includes("config") ? 500 : 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("sign-in API error", err);
    return NextResponse.json(
      { success: false, message: "Failed to sign in" },
      { status: 500 }
    );
  }
}
