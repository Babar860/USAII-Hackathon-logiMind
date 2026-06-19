import { NextResponse } from "next/server";
import { getShipmentAsync } from "@/lib/store";

export async function GET(_request: Request, { params }: { params: Promise<{ trackingNumber: string }> }) {
  const { trackingNumber } = await params;
  const shipment = await getShipmentAsync(trackingNumber);
  return shipment ? NextResponse.json(shipment) : NextResponse.json({ error: "Shipment not found" }, { status: 404 });
}
