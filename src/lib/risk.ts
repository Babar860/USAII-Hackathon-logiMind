import type { Carrier, EnrichedShipment, RiskLevel, Shipment } from "./types";

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return "Low";
  if (score <= 60) return "Medium";
  if (score <= 80) return "High";
  return "Critical";
}

export function calculateRisk(shipment: Shipment, carrier?: Carrier): EnrichedShipment {
  let riskScore = 0;
  const riskFactors: string[] = [];
  const slaDeadline = new Date(shipment.slaDeadline).getTime();
  const estimatedDelivery = new Date(shipment.estimatedDelivery).getTime();

  if (estimatedDelivery > slaDeadline) {
    riskScore += 40;
    riskFactors.push("Estimated delivery is after SLA deadline");
  }

  if (shipment.delayHours > 12) {
    riskScore += 30;
    riskFactors.push("Delay exceeds 12 hours");
  }

  if (carrier && carrier.onTimeRate < 80) {
    riskScore += 20;
    riskFactors.push(`${carrier.name} on-time rate is below 80%`);
  }

  if (shipment.priority === "High") {
    riskScore += 10;
    riskFactors.push("Shipment is high priority");
  }

  if (shipment.attempts >= 2) {
    riskScore += 10;
    riskFactors.push("Multiple delivery attempts have failed");
  }

  if (shipment.routeRisk === "High" || shipment.routeRisk === "Critical") {
    riskScore += 10;
    riskFactors.push("Route risk is elevated");
  }

  const score = clamp(riskScore);
  const carrierPenalty = carrier ? Math.max(0, 90 - carrier.onTimeRate) * 0.35 : 8;
  const slaBreachProbability = clamp(Math.round(score * 0.82 + shipment.delayHours * 0.75 + carrierPenalty));
  const confidenceScore = clamp(
    Math.round(92 - (carrier ? 0 : 16) - (shipment.routeRisk === "Critical" ? 6 : 0) - Math.max(0, 4 - shipment.attempts) * 2)
  );

  return {
    ...shipment,
    riskScore: score,
    riskLevel: getRiskLevel(score),
    slaBreachProbability,
    confidenceScore,
    riskFactors
  };
}
