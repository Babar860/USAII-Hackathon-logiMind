import { NextResponse } from "next/server";
import { createAlert, getAlertsAsync } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await getAlertsAsync());
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(createAlert(body), { status: 201 });
}
