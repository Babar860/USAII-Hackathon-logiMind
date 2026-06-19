import type { EnrichedShipment, ScenarioResult } from "./types";
import { getRiskLevel } from "./risk";

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const interventions = [
  { action: "Do Nothing", reduction: 0, cost: 0, confidenceDelta: -8 },
  { action: "Escalate Carrier", reduction: 6, cost: 40, confidenceDelta: 2 },
  { action: "Notify Customer", reduction: 1, cost: 5, confidenceDelta: 6 },
  { action: "Prioritize Warehouse Dispatch", reduction: 5, cost: 65, confidenceDelta: 0 },
  { action: "Assign Backup Carrier", reduction: 8, cost: 120, confidenceDelta: -4 }
] as const;

export function runScenarios(shipment: EnrichedShipment): ScenarioResult[] {
  return interventions.map((intervention) => {
    const impact = intervention.reduction * 5 + (intervention.action === "Do Nothing" ? -8 : 0);
    const newRiskScore = clamp(shipment.riskScore - impact);
    const confidence = clamp(shipment.confidenceScore + intervention.confidenceDelta);
    const level = getRiskLevel(newRiskScore);

    return {
      action: intervention.action,
      newRiskScore,
      estimatedDelayReductionHours: intervention.reduction,
      costImpact: intervention.cost,
      confidence,
      requiresApproval: level === "Critical" || intervention.cost >= 100 || confidence < 50
    };
  });
}

export function recommendedScenario(shipment: EnrichedShipment): ScenarioResult {
  const viable = runScenarios(shipment).filter((scenario) => scenario.action !== "Do Nothing");
  return viable.toSorted((a, b) => a.newRiskScore - b.newRiskScore || a.costImpact - b.costImpact)[0];
}
