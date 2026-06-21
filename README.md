# LogiMind AI

Predictive logistics decision-support dashboard based on `implementation doc.md`.

## Submission materials

- [Copy-ready submission packet](docs/submission-packet.md)
- [3-5 minute pitch and demo script](docs/demo-script.md)
- [Agent fallback verification](docs/agent-fallback.md)
- [Narrated 3:30 submission video](output/video/LogiMind-AI-Pitch.mp4)

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Run the focused policy and reasoning tests with:

```bash
npm test
```

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
- Explicit `viewer`, `operator`, `approver`, and `admin` roles with server-side permission checks
- Shared LogiMind agent policy matching the tested Agent Studio instructions

## Environment

Copy `.env.example` to `.env.local` for Next.js and `.env` for the Express backend when wiring live services.

Required for live integrations:

- `MONGODB_URI`
- `MONGODB_DB`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `APP_USER_ROLE` (`viewer`, `operator`, `approver`, or `admin`)

`GOOGLE_CLOUD_AGENT_ID` is optional. Leave it empty while Agent Runtime deployment is unavailable; the local agent workflow remains active.

The app runs without cloud values using in-memory seed data and deterministic reasoning. Development defaults to the `approver` role for a complete demo; production defaults to `viewer` unless `APP_USER_ROLE` is set. This environment-based role is a demo boundary, not a replacement for authenticated identity claims.

## MongoDB MCP

Use [mcp/mongodb-mcp.example.json](mcp/mongodb-mcp.example.json) as the Codex MCP server template:

- Name: `mongodb`
- Transport: `stdio`
- Command: `npx`
- Arguments: `-y`, `mongodb-mcp-server`
- Environment variable: `MDB_MCP_CONNECTION_STRING`

The MCP connection string is configured in Codex settings, not in app source code.

## Remaining Work

- Deploy the configured Agent Studio agent when a billing-enabled Google Cloud project is available
- Replace the environment-based demo role with authenticated identity claims before production exposure
