import "dotenv/config";
import { MongoClient } from "mongodb";
import dns from "node:dns";
import { alerts, carriers, humanDecisions, shipments } from "../src/lib/data";

const uri = process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri || !dbName) {
  console.error("Set MONGODB_URI or MONGODB_URI_DIRECT, plus MONGODB_DB, before running npm run seed:mongodb.");
  process.exit(1);
}

const client = new MongoClient(uri);
const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(",").map((server) => server.trim()).filter(Boolean);
if (dnsServers?.length) dns.setServers(dnsServers);

async function seed() {
  await client.connect();
  const db = client.db(dbName);

  await Promise.all([
    db.collection("shipments").createIndex({ trackingNumber: 1 }, { unique: true }),
    db.collection("carriers").createIndex({ name: 1 }, { unique: true }),
    db.collection("alerts").createIndex({ id: 1 }, { unique: true }),
    db.collection("agent_logs").createIndex({ id: 1 }, { unique: true }),
    db.collection("human_decisions").createIndex({ id: 1 }, { unique: true })
  ]);

  await Promise.all([
    ...shipments.map((shipment) =>
      db.collection("shipments").replaceOne({ trackingNumber: shipment.trackingNumber }, shipment, { upsert: true })
    ),
    ...carriers.map((carrier) => db.collection("carriers").replaceOne({ name: carrier.name }, carrier, { upsert: true })),
    ...alerts.map((alert) => db.collection("alerts").replaceOne({ id: alert.id }, alert, { upsert: true })),
    ...humanDecisions.map((decision) =>
      db.collection("human_decisions").replaceOne({ id: decision.id }, decision, { upsert: true })
    )
  ]);

  console.log(`Seeded ${shipments.length} shipments, ${carriers.length} carriers, ${alerts.length} alerts, and ${humanDecisions.length} decisions into ${dbName}.`);
}

seed()
  .finally(async () => {
    await client.close();
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
