import { NextResponse } from "next/server";
import { analyzeAgentQuery } from "@/lib/store";

export async function POST(request: Request) {
  const { query } = await request.json();
  return NextResponse.json(await analyzeAgentQuery(query ?? "Which shipments may miss SLA today?"));
}
