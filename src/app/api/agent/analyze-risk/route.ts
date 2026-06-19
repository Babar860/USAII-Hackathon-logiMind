import { NextResponse } from "next/server";
import { getShipmentsAsync } from "@/lib/store";

export async function POST() {
  return NextResponse.json((await getShipmentsAsync()).toSorted((a, b) => b.riskScore - a.riskScore));
}
