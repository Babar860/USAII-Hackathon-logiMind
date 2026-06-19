import { NextResponse } from "next/server";
import { getAgentLogsAsync } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await getAgentLogsAsync());
}
