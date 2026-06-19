import { NextResponse } from "next/server";
import { createDecision, getDecisionsAsync } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await getDecisionsAsync());
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(createDecision(body), { status: 201 });
}
