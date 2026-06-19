import { MongoClient, type Collection, type Db } from "mongodb";
import dns from "node:dns";
import type { AgentLog, Alert, Carrier, HumanDecision, Shipment } from "./types";

let clientPromise: Promise<MongoClient> | undefined;
let dnsConfigured = false;

function configureMongoDns() {
  if (dnsConfigured) return;
  const servers = process.env.MONGODB_DNS_SERVERS?.split(",").map((server) => server.trim()).filter(Boolean);
  if (servers?.length) dns.setServers(servers);
  dnsConfigured = true;
}

export function isMongoConfigured() {
  return Boolean((process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI) && process.env.MONGODB_DB);
}

async function getDb(): Promise<Db | undefined> {
  if (!isMongoConfigured()) return undefined;
  configureMongoDns();
  clientPromise ??= new MongoClient((process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI) as string).connect();
  return (await clientPromise).db(process.env.MONGODB_DB);
}

async function collection<T extends object>(name: string): Promise<Collection<T> | undefined> {
  const db = await getDb();
  return db?.collection<T>(name);
}

export async function getMongoCollections() {
  return {
    shipments: await collection<Shipment>("shipments"),
    carriers: await collection<Carrier>("carriers"),
    alerts: await collection<Alert>("alerts"),
    agentLogs: await collection<AgentLog>("agent_logs"),
    humanDecisions: await collection<HumanDecision>("human_decisions")
  };
}

export async function getMongoIntegrationStatus() {
  if (!isMongoConfigured()) {
    return {
      configured: false,
      connected: false,
      database: null,
      message: "MONGODB_URI and MONGODB_DB are not configured; using in-memory demo data."
    };
  }

  try {
    const db = await getDb();
    await db?.command({ ping: 1 });
    return {
      configured: true,
      connected: true,
      database: process.env.MONGODB_DB,
      message: "MongoDB Atlas connection is healthy."
    };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      database: process.env.MONGODB_DB,
      message: error instanceof Error ? error.message : "MongoDB connection failed."
    };
  }
}

export async function closeMongoConnection() {
  if (!clientPromise) return;
  const client = await clientPromise;
  await client.close();
  clientPromise = undefined;
}
