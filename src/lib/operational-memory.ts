import { getMongoCollections, isMongoConfigured } from "./mongodb";
import type { AgentLog, Alert, HumanDecision } from "./types";

export async function persistAgentLog(log: AgentLog) {
  if (!isMongoConfigured()) return { persisted: false, target: "memory" as const };
  try {
    const { agentLogs } = await getMongoCollections();
    await agentLogs?.replaceOne({ id: log.id }, log, { upsert: true });
    return { persisted: true, target: "mongodb" as const };
  } catch {
    return { persisted: false, target: "memory" as const };
  }
}

export async function persistAlert(alert: Alert) {
  if (!isMongoConfigured()) return { persisted: false, target: "memory" as const };
  try {
    const { alerts } = await getMongoCollections();
    await alerts?.updateOne({ id: alert.id }, { $set: alert }, { upsert: true });
    return { persisted: true, target: "mongodb" as const };
  } catch {
    return { persisted: false, target: "memory" as const };
  }
}

export async function persistHumanDecision(decision: HumanDecision) {
  if (!isMongoConfigured()) return { persisted: false, target: "memory" as const };
  try {
    const { humanDecisions } = await getMongoCollections();
    await humanDecisions?.replaceOne({ id: decision.id }, decision, { upsert: true });
    return { persisted: true, target: "mongodb" as const };
  } catch {
    return { persisted: false, target: "memory" as const };
  }
}
