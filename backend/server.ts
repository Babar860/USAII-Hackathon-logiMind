import "dotenv/config";
import cors from "cors";
import express from "express";
import { getMongoIntegrationStatus } from "../src/lib/mongodb";
import { runScenarios } from "../src/lib/scenarios";
import {
  analyzeAgentQuery,
  createAlert,
  createDecision,
  getAgentLogsAsync,
  getAlertsAsync,
  getCarriersAsync,
  getDecisionsAsync,
  getShipmentAsync,
  getShipmentsAsync,
  updateAlertStatus
} from "../src/lib/store";

const app = express();
const port = Number(process.env.PORT ?? 8080);

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "logimind-express-api" });
});

app.get("/api/shipments", async (_request, response) => {
  response.json(await getShipmentsAsync());
});

app.get("/api/shipments/:trackingNumber", async (request, response) => {
  const shipment = await getShipmentAsync(request.params.trackingNumber);
  if (!shipment) {
    response.status(404).json({ error: "Shipment not found" });
    return;
  }
  response.json(shipment);
});

app.get("/api/carriers", async (_request, response) => {
  response.json(await getCarriersAsync());
});

app.get("/api/alerts", async (_request, response) => {
  response.json(await getAlertsAsync());
});

app.post("/api/alerts", (request, response) => {
  response.status(201).json(createAlert(request.body));
});

app.patch("/api/alerts/:id/status", (request, response) => {
  const alert = updateAlertStatus(request.params.id, request.body.status);
  if (!alert) {
    response.status(404).json({ error: "Alert not found" });
    return;
  }
  response.json(alert);
});

app.post("/api/agent/query", async (request, response) => {
  response.json(await analyzeAgentQuery(request.body.query ?? "Which shipments may miss SLA today?"));
});

app.post("/api/agent/analyze-risk", async (_request, response) => {
  response.json((await getShipmentsAsync()).toSorted((a, b) => b.riskScore - a.riskScore));
});

app.get("/api/agent/logs", async (_request, response) => {
  response.json(await getAgentLogsAsync());
});

app.post("/api/scenarios/run", async (request, response) => {
  const shipment = await getShipmentAsync(request.body.trackingNumber);
  if (!shipment) {
    response.status(404).json({ error: "Shipment not found" });
    return;
  }
  response.json(runScenarios(shipment));
});

app.get("/api/human-decisions", async (_request, response) => {
  response.json(await getDecisionsAsync());
});

app.post("/api/human-decisions", (request, response) => {
  response.status(201).json(createDecision(request.body));
});

app.get("/api/integrations/status", async (_request, response) => {
  response.json({
    mongodb: await getMongoIntegrationStatus(),
    gemini: {
      configured: Boolean(process.env.GEMINI_API_KEY),
      model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash"
    },
    agentBuilder: {
      configured: Boolean(process.env.GOOGLE_CLOUD_AGENT_ID)
    }
  });
});

app.listen(port, () => {
  console.log(`LogiMind Express API listening on http://localhost:${port}`);
});
