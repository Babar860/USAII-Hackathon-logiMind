import { NextResponse } from "next/server";
import { getMongoIntegrationStatus } from "@/lib/mongodb";

export async function GET() {
  return NextResponse.json({
    mongodb: await getMongoIntegrationStatus(),
    gemini: {
      configured: Boolean(process.env.GEMINI_API_KEY),
      model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
      message: process.env.GEMINI_API_KEY ? "Gemini reasoning is configured." : "GEMINI_API_KEY is not configured; using deterministic fallback."
    },
    agentBuilder: {
      configured: Boolean(process.env.GOOGLE_CLOUD_AGENT_ID),
      message: process.env.GOOGLE_CLOUD_AGENT_ID
        ? "Google Cloud Agent Builder identifier is configured."
        : "GOOGLE_CLOUD_AGENT_ID is not configured; local agent workflow is active."
    },
    mongodbMcp: {
      expected: true,
      message: "MongoDB MCP should be configured in the Codex environment for live demo inspection of Atlas collections."
    }
  });
}
