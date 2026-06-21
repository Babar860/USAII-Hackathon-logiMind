import { NextResponse } from "next/server";
import { createDecision, getDecisionsAsync } from "@/lib/store";
import { getAppRole, hasPermission, roleLabels } from "@/lib/roles";

export async function GET() {
  return NextResponse.json(await getDecisionsAsync());
}

export async function POST(request: Request) {
  const role = getAppRole();
  if (!hasPermission(role, "decisions:approve")) {
    return NextResponse.json({ error: "The configured role cannot approve operational decisions." }, { status: 403 });
  }
  const body = await request.json();
  return NextResponse.json(createDecision({ ...body, approvedBy: roleLabels[role] }), { status: 201 });
}
