import { NextResponse } from "next/server";
import { updateAlertStatus } from "@/lib/store";
import { getAppRole, hasPermission } from "@/lib/roles";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasPermission(getAppRole(), "alerts:manage")) {
    return NextResponse.json({ error: "The configured role cannot manage alerts." }, { status: 403 });
  }
  const { id } = await params;
  const { status } = await request.json();
  const alert = updateAlertStatus(id, status);
  return alert ? NextResponse.json(alert) : NextResponse.json({ error: "Alert not found" }, { status: 404 });
}
