import { NextResponse } from "next/server";
import { analyzeAgentQuery } from "@/lib/store";
import { getAppRole, hasPermission } from "@/lib/roles";

export async function POST(request: Request) {
  if (!hasPermission(getAppRole(), "agent:query")) {
    return NextResponse.json({ error: "The configured role cannot run agent analysis." }, { status: 403 });
  }
  const { query } = await request.json();
  return NextResponse.json(await analyzeAgentQuery(query ?? "Which shipments may miss SLA today?"));
}
