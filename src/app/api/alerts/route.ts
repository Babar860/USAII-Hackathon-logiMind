import { NextResponse } from "next/server";
import { createAlert, getAlertsAsync } from "@/lib/store";
import { getAppRole, hasPermission } from "@/lib/roles";

export async function GET() {
  return NextResponse.json(await getAlertsAsync());
}

export async function POST(request: Request) {
  if (!hasPermission(getAppRole(), "alerts:manage")) {
    return NextResponse.json({ error: "The configured role cannot create alerts." }, { status: 403 });
  }
  const body = await request.json();
  return NextResponse.json(createAlert(body), { status: 201 });
}
