import { GoogleGenerativeAI } from "@google/generative-ai";
import type { EnrichedShipment, ScenarioResult } from "./types";

interface ReasoningInput {
  userQuery: string;
  atRisk: EnrichedShipment[];
  topShipment: EnrichedShipment;
  scenarios: ScenarioResult[];
  recommendation: ScenarioResult;
}

export async function generateOperationalReasoning(input: ReasoningInput) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      provider: "Deterministic fallback" as const,
      text: fallbackReasoning(input),
      warnings: ["GEMINI_API_KEY is not configured; used deterministic reasoning fallback."]
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash" });
    const prompt = [
      "You are LogiMind AI, a logistics decision-support assistant.",
      "Do not approve actions or write to databases. Explain risk, tradeoffs, uncertainty, and human approval needs.",
      `User query: ${input.userQuery}`,
      `Top shipment: ${JSON.stringify(input.topShipment)}`,
      `At-risk shipments: ${JSON.stringify(input.atRisk.map((shipment) => shipment.trackingNumber))}`,
      `Scenario comparisons: ${JSON.stringify(input.scenarios)}`,
      `Recommended action: ${JSON.stringify(input.recommendation)}`,
      "Return a concise operations-ready explanation in 4 sentences or fewer."
    ].join("\n");
    const result = await model.generateContent(prompt);
    return {
      provider: "Gemini" as const,
      text: result.response.text(),
      warnings: [] as string[]
    };
  } catch (error) {
    return {
      provider: "Deterministic fallback" as const,
      text: fallbackReasoning(input),
      warnings: [`Gemini reasoning failed: ${error instanceof Error ? error.message : "Unknown error"}`]
    };
  }
}

function fallbackReasoning({ atRisk, topShipment, recommendation }: ReasoningInput) {
  const factors = topShipment.riskFactors.length > 0 ? topShipment.riskFactors.join("; ") : "No dominant risk factors were detected";
  const approval = recommendation.requiresApproval ? "Human approval is required before execution." : "This action can proceed without additional approval.";
  return `${atRisk.length} shipments are currently high or critical risk. ${topShipment.trackingNumber} should be prioritized because ${factors}. ${recommendation.action} gives the best risk reduction tradeoff at ${recommendation.confidence}% confidence. ${approval}`;
}
