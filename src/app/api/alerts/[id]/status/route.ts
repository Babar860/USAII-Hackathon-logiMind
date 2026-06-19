import { NextResponse } from "next/server";
import { updateAlertStatus } from "@/lib/store";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await request.json();
  const alert = updateAlertStatus(id, status);
  return alert ? NextResponse.json(alert) : NextResponse.json({ error: "Alert not found" }, { status: 404 });
}
