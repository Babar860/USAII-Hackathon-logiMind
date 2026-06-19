import { NextResponse } from "next/server";
import { getShipmentAsync } from "@/lib/store";
import { runScenarios } from "@/lib/scenarios";

export async function POST(request: Request) {
  const { trackingNumber } = await request.json();
  const shipment = await getShipmentAsync(trackingNumber);
  if (!shipment) return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
  return NextResponse.json(runScenarios(shipment));
}
