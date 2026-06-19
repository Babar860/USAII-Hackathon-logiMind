import { NextResponse } from "next/server";
import { getShipmentsAsync } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await getShipmentsAsync());
}
