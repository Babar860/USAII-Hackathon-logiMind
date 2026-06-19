# LogiMind AI

Predictive logistics decision-support dashboard based on `implementation doc.md`.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

To run the standalone Express API described in the architecture:

```bash
npm run backend:dev
```

The Express API listens on `http://localhost:8080` by default.

To seed MongoDB Atlas for the demo:

```bash
npm run seed:mongodb
```

## Implemented

- Dashboard with shipment, alert, carrier, recommendation, and decision views
- Deterministic SLA risk scoring and confidence estimation
- Scenario simulation for operational interventions
- Agent query endpoint with auditable reasoning output
- Human approval workflow for recommendations
- Standalone Express API using the same risk, scenario, and agent workflow
- Gemini reasoning boundary with deterministic fallback when `GEMINI_API_KEY` is absent
- MongoDB Atlas adapter that reads configured collections and falls back to seed data
- Integration status endpoint for MongoDB, Gemini, Agent Builder, and MongoDB MCP readiness

## Environment

Copy `.env.example` to `.env.local` for Next.js and `.env` for the Express backend when wiring live services.

Required for live integrations:

- `MONGODB_URI`
- `MONGODB_DB`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `GOOGLE_CLOUD_AGENT_ID`

The app runs without these values using in-memory seed data and deterministic reasoning.

## MongoDB MCP

Use [mcp/mongodb-mcp.example.json](mcp/mongodb-mcp.example.json) as the Codex MCP server template:

- Name: `mongodb`
- Transport: `stdio`
- Command: `npx`
- Arguments: `-y`, `mongodb-mcp-server`
- Environment variable: `MDB_MCP_CONNECTION_STRING`

The MCP connection string is configured in Codex settings, not in app source code.

## Remaining Work

- Provision Google Cloud Agent Builder and connect the local agent workflow to that deployed agent
- Add authentication/roles before exposing approval actions outside a demo environment
