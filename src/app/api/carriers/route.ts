import { NextResponse } from "next/server";
import { getCarriersAsync } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await getCarriersAsync());
}
