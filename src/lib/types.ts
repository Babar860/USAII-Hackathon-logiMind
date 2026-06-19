export type Priority = "Low" | "Medium" | "High";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type ShipmentStatus = "Pending" | "In Transit" | "Delayed" | "Out for Delivery";
export type AlertStatus = "Open" | "Acknowledged" | "Resolved";

export interface Shipment {
  trackingNumber: string;
  carrier: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  slaDeadline: string;
  estimatedDelivery: string;
  delayHours: number;
  priority: Priority;
  attempts: number;
  routeRisk: RiskLevel;
}

export interface EnrichedShipment extends Shipment {
  riskScore: number;
  riskLevel: RiskLevel;
  slaBreachProbability: number;
  confidenceScore: number;
  riskFactors: string[];
}

export interface Carrier {
  name: string;
  averageDelayHours: number;
  onTimeRate: number;
  activeShipments: number;
}

export interface Alert {
  id: string;
  shipmentId: string;
  riskLevel: RiskLevel;
  reason: string;
  recommendedAction: string;
  status: AlertStatus;
}

export interface ScenarioResult {
  action: string;
  newRiskScore: number;
  estimatedDelayReductionHours: number;
  costImpact: number;
  confidence: number;
  requiresApproval: boolean;
}

export interface AgentLog {
  id: string;
  userQuery: string;
  steps: string[];
  shipmentIds: string[];
  riskFactors: string[];
  scenarioComparisons: ScenarioResult[];
  reasoning: string;
  confidenceScore: number;
  recommendedAction: string;
  humanDecision: "Pending" | "Approved" | "Rejected" | "Not Required";
  finalOutcome: string;
  createdAt: string;
}

export interface AgentAnalysis {
  answer: string;
  atRisk: EnrichedShipment[];
  topShipment: EnrichedShipment;
  scenarios: ScenarioResult[];
  recommendation: ScenarioResult;
  log: AgentLog;
  modelProvider: "Gemini" | "Deterministic fallback";
  warnings: string[];
}

export interface HumanDecision {
  id: string;
  shipmentId: string;
  actionRecommended: string;
  actionApproved: boolean;
  approvedBy: string;
  createdAt: string;
}
