import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token, refreshToken, expiresIn } = await request.json();
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });

    const accessMaxAge = typeof expiresIn === "number" ? Math.floor(expiresIn / 1000) : 60 * 60 * 24; // default 1 day
    const refreshMaxAge = 60 * 60 * 24 * 7; // 7 days

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: accessMaxAge,
    });

    if (refreshToken) {
      res.cookies.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: refreshMaxAge,
      });
    }

    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
