import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      app: "sysTROL Web Public",
      timestamp: Date.now(),
    },
    { status: 200 }
  );
}
