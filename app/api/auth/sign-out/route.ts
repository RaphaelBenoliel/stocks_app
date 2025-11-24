import { NextResponse } from "next/server";
import { auth } from "@/lib/better-auth/auth";

export async function POST(request: Request) {
  try {
    await auth.api.signOut({ headers: request.headers });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("sign-out API error", err);
    return NextResponse.json(
      { success: false, message: "Failed to sign out" },
      { status: 500 }
    );
  }
}
