import { NextResponse } from "next/server";

export function Middleware() {
  return NextResponse.json({
    name: "Vipul",
  });
}

export const config = {
  matcher: "/auth/verify",
};
