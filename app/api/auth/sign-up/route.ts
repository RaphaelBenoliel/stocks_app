import { NextResponse } from "next/server";
import { signUpWithEmail } from "@/lib/actions/auth.actions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, country, investmentGoals, riskTolerance, preferredIndustry } = body || {};

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await signUpWithEmail({
      fullName,
      email,
      password,
      country,
      investmentGoals,
      riskTolerance,
      preferredIndustry,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error ?? "Unable to sign up" },
        { status: result.error?.toLowerCase().includes("config") ? 500 : 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("sign-up API error", err);
    return NextResponse.json(
      { success: false, message: "Failed to sign up" },
      { status: 500 }
    );
  }
}
