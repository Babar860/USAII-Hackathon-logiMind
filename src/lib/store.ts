import { alerts, carriers, humanDecisions, shipments } from "./data";
import { getMongoCollections, isMongoConfigured } from "./mongodb";
import { persistAgentLog, persistAlert, persistHumanDecision } from "./operational-memory";
import { generateOperationalReasoning } from "./reasoning";
import { calculateRisk } from "./risk";
import { recommendedScenario, runScenarios } from "./scenarios";
import type { AgentAnalysis, AgentLog, Alert, Carrier, HumanDecision, Shipment } from "./types";

const mutableAlerts: Alert[] = [...alerts];
const mutableDecisions: HumanDecision[] = [...humanDecisions];
const agentLogs: AgentLog[] = [];

export function getCarriers() {
  return carriers;
}

export async function getCarriersAsync() {
  if (!isMongoConfigured()) return getCarriers();
  try {
    const { carriers: carrierCollection } = await getMongoCollections();
    const records = await carrierCollection?.find({}).project({ _id: 0 }).toArray();
    return records?.length ? (records as Carrier[]) : getCarriers();
  } catch {
    return getCarriers();
  }
}

export function getShipments() {
  return shipments.map((shipment) => calculateRisk(shipment, carriers.find((carrier) => carrier.name === shipment.carrier)));
}

export async function getShipmentsAsync() {
  if (!isMongoConfigured()) return getShipments();
  try {
    const { shipments: shipmentCollection } = await getMongoCollections();
    const [shipmentRecords, carrierRecords] = await Promise.all([
      shipmentCollection?.find({}).project({ _id: 0 }).toArray(),
      getCarriersAsync()
    ]);
    const sourceShipments = shipmentRecords?.length ? (shipmentRecords as Shipment[]) : shipments;
    return sourceShipments.map((shipment) => calculateRisk(shipment, carrierRecords.find((carrier) => carrier.name === shipment.carrier)));
  } catch {
    return getShipments();
  }
}

export function getShipment(trackingNumber: string) {
  return getShipments().find((shipment) => shipment.trackingNumber === trackingNumber);
}

export async function getShipmentAsync(trackingNumber: string) {
  return (await getShipmentsAsync()).find((shipment) => shipment.trackingNumber === trackingNumber);
}

export function getAlerts() {
  return mutableAlerts;
}

export async function getAlertsAsync() {
  if (!isMongoConfigured()) return getAlerts();
  try {
    const { alerts: alertCollection } = await getMongoCollections();
    const records = await alertCollection?.find({}).project({ _id: 0 }).toArray();
    return records?.length ? (records as Alert[]) : getAlerts();
  } catch {
    return getAlerts();
  }
}

export function createAlert(alert: Omit<Alert, "id">) {
  const record = { ...alert, id: `ALT-${1000 + mutableAlerts.length + 1}` };
  mutableAlerts.unshift(record);
  void persistAlert(record);
  return record;
}

export function updateAlertStatus(id: string, status: Alert["status"]) {
  const alert = mutableAlerts.find((item) => item.id === id);
  if (!alert) return undefined;
  alert.status = status;
  void persistAlert(alert);
  return alert;
}

export function createDecision(decision: Omit<HumanDecision, "id" | "createdAt">) {
  const record: HumanDecision = {
    ...decision,
    id: `DEC-${2400 + mutableDecisions.length + 1}`,
    createdAt: new Date().toISOString()
  };
  mutableDecisions.unshift(record);
  const relatedLog = agentLogs.find(
    (log) =>
      log.shipmentIds.includes(record.shipmentId) &&
      log.recommendedAction === record.actionRecommended &&
      log.humanDecision === "Pending"
  );
  if (relatedLog) {
    relatedLog.humanDecision = record.actionApproved ? "Approved" : "Rejected";
    relatedLog.finalOutcome = record.actionApproved
      ? `${record.actionRecommended} approved by ${record.approvedBy}`
      : `${record.actionRecommended} rejected by ${record.approvedBy}`;
    void persistAgentLog(relatedLog);
  }
  void persistHumanDecision(record);
  return record;
}

export function getDecisions() {
  return mutableDecisions;
}

export async function getDecisionsAsync() {
  if (!isMongoConfigured()) return getDecisions();
  try {
    const { humanDecisions: decisionCollection } = await getMongoCollections();
    const records = await decisionCollection?.find({}).project({ _id: 0 }).toArray();
    return records?.length ? (records as HumanDecision[]) : getDecisions();
  } catch {
    return getDecisions();
  }
}

export async function analyzeAgentQuery(userQuery: string): Promise<AgentAnalysis> {
  const enriched = (await getShipmentsAsync()).toSorted((a, b) => b.riskScore - a.riskScore);
  const atRisk = enriched.filter((shipment) => shipment.riskLevel === "High" || shipment.riskLevel === "Critical");
  const topShipment = atRisk[0] ?? enriched[0];
  const scenarios = runScenarios(topShipment);
  const recommendation = recommendedScenario(topShipment);
  const confidenceScore = Math.round(atRisk.reduce((sum, item) => sum + item.confidenceScore, 0) / Math.max(1, atRisk.length));
  const reasoning = await generateOperationalReasoning({ userQuery, atRisk, topShipment, scenarios, recommendation });
  const requiresHumanReview = recommendation.requiresApproval || confidenceScore < 50 || topShipment.riskLevel === "Critical";

  const log: AgentLog = {
    id: `LOG-${agentLogs.length + 1}`.padStart(8, "0"),
    userQuery,
    steps: [
      "Fetched active shipments",
      "Fetched carrier performance",
      "Calculated deterministic SLA risk scores",
      "Ran intervention scenarios",
      "Generated confidence-aware recommendation"
    ],
    shipmentIds: atRisk.map((shipment) => shipment.trackingNumber),
    riskFactors: topShipment.riskFactors,
    scenarioComparisons: scenarios,
    reasoning: reasoning.text,
    confidenceScore,
    recommendedAction: recommendation.action,
    humanDecision: requiresHumanReview ? "Pending" : "Not Required",
    finalOutcome: requiresHumanReview ? "Awaiting operations manager approval" : "Recommendation ready for execution",
    createdAt: new Date().toISOString()
  };
  agentLogs.unshift(log);
  void persistAgentLog(log);

  if (topShipment.riskLevel === "Critical" || topShipment.riskLevel === "High") {
    const existing = mutableAlerts.some((alert) => alert.shipmentId === topShipment.trackingNumber && alert.status !== "Resolved");
    if (!existing) {
      createAlert({
        shipmentId: topShipment.trackingNumber,
        riskLevel: topShipment.riskLevel,
        reason: `${topShipment.riskLevel} SLA miss risk: ${topShipment.riskFactors[0] ?? "multiple risk signals detected"}`,
        recommendedAction: recommendation.action,
        status: "Open"
      });
    }
  }

  return {
    answer: reasoning.text,
    atRisk,
    topShipment,
    scenarios,
    recommendation,
    log,
    modelProvider: reasoning.provider,
    warnings: reasoning.warnings
  };
}

export function getAgentLogs() {
  return agentLogs;
}

export async function getAgentLogsAsync() {
  if (!isMongoConfigured()) return getAgentLogs();
  try {
    const { agentLogs: agentLogCollection } = await getMongoCollections();
    const records = await agentLogCollection?.find({}).project({ _id: 0 }).sort({ createdAt: -1 }).toArray();
    return records?.length ? (records as AgentLog[]) : getAgentLogs();
  } catch {
    return getAgentLogs();
  }
}
