# LogiMind AI
## Predictive Logistics Decision-Support Agent

### Tagline
An AI-powered logistics decision-support agent that predicts SLA failures, simulates intervention options, explains uncertainty, and supports human-approved operational decisions using Gemini, MongoDB Atlas, and MongoDB MCP.

---

# Problem Statement

Logistics teams manage hundreds of shipments across multiple carriers, warehouses, routes, and destinations. Most operations remain reactive, identifying delays only after Service Level Agreements (SLAs) have already been missed.

This leads to:

- SLA violations
- Increased operational costs
- Poor customer experience
- Manual monitoring overhead
- Delayed decision-making
- Escalation inefficiencies

Current dashboards show what has already happened, but they rarely help operators determine:

- Which shipment should be prioritized first?
- What is likely to happen next?
- What action should be taken now?
- What happens if no action is taken?

---

# Solution

LogiMind AI is a predictive logistics decision-support agent that proactively identifies shipment risks before SLA breaches occur.

The platform combines:

- Deterministic risk prediction
- AI-powered reasoning
- Scenario simulation
- Human approval workflows
- Operational memory

to help logistics teams make better operational decisions.

Rather than simply displaying delayed shipments, LogiMind AI predicts future risk, compares intervention options, explains tradeoffs, and maintains a complete audit trail of decisions.

---

# Why AI Is Needed

Traditional dashboards and filters can identify delayed shipments.

However, they cannot:

- Analyze multiple risk signals simultaneously
- Predict future SLA failure probability
- Compare intervention strategies
- Explain tradeoffs
- Answer operational questions in natural language
- Quantify uncertainty

Example:

A shipment may not currently be delayed, but:

- Carrier reliability is declining
- Route risk is increasing
- Previous delivery attempts failed
- SLA deadline is approaching

The AI system combines these signals to predict risk before a failure occurs.

---

# Core Objectives

- Predict SLA failure risk
- Explain why shipments are risky
- Simulate operational interventions
- Compare intervention tradeoffs
- Provide confidence-aware recommendations
- Keep humans in control
- Maintain decision history

---

# System Architecture

```txt
Next.js Frontend
        │
        ▼
Express Backend API
        │
        ▼
Risk Prediction Engine
        │
        ▼
Scenario Simulation Engine
        │
        ▼
Gemini Reasoning Layer
        │
        ▼
MongoDB Atlas
        │
        ▼
Audit Logs + Alerts + Decisions
```

---

# Technology Stack

## Frontend

- Next.js
- React
- Tailwind CSS
- Axios

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- MongoDB Atlas

## AI Layer

- Gemini API

## Agent Layer

- Google Cloud Agent Builder

## MCP Integration

- MongoDB MCP Server

## Deployment

### Frontend

- Vercel

### Backend

- Google Cloud Run

### Database

- MongoDB Atlas

---

# Core Components

## 1. Risk Prediction Engine

Responsible for:

- Risk scoring
- SLA breach prediction
- Confidence estimation
- Delay forecasting

This layer uses deterministic calculations.

### Inputs

- SLA deadline
- Estimated delivery
- Delay hours
- Carrier performance
- Shipment priority
- Route risk
- Failed attempts

### Outputs

- Risk score
- Risk level
- SLA breach probability
- Confidence score

---

## 2. Scenario Simulation Engine

For each risky shipment, multiple operational interventions are simulated.

### Simulations

1. Do Nothing
2. Escalate Carrier
3. Notify Customer
4. Prioritize Warehouse Dispatch
5. Assign Backup Carrier

### Output

```json
{
  "action": "Assign Backup Carrier",
  "newRiskScore": 55,
  "estimatedDelayReductionHours": 8,
  "costImpact": 120,
  "confidence": 76
}
```

---

## 3. Gemini Reasoning Engine

Gemini is used for:

- Natural language understanding
- Operational reasoning
- Tradeoff explanation
- Recommendation generation
- Risk explanation
- Carrier performance summaries

Gemini is NOT used for:

- Database writes
- Final approvals
- Risk score calculation
- Autonomous rerouting

---

# Human-in-the-Loop Design

Humans always retain final control.

### Human Approval Required

- Critical-risk shipments
- High-cost interventions
- Low-confidence recommendations
- Irreversible actions

### AI Responsibilities

- Predict risk
- Explain findings
- Compare actions
- Recommend next steps

### Human Responsibilities

- Approve interventions
- Escalate carriers
- Notify customers
- Resolve alerts

---

# Responsible AI Framework

## Confidence Levels

### High Confidence

```txt
Confidence > 80%
```

Recommendation shown directly.

### Medium Confidence

```txt
50% - 80%
```

Recommendation shown with warning.

### Low Confidence

```txt
< 50%
```

Human review required.

---

## Fallback Logic

If confidence is low:

```txt
No recommendation generated.
Human review required.
```

If carrier data is stale:

```txt
Warning displayed.
Confidence reduced.
```

If shipment data is incomplete:

```txt
Risk assessment marked uncertain.
```

---

## Audit Trail

Every recommendation stores:

- User query
- Shipment analyzed
- Risk factors
- Scenario comparisons
- Confidence score
- Recommended action
- Human decision
- Final outcome

---

# Database Collections

## Shipments

```json
{
  "trackingNumber": "PK123",
  "carrier": "DHL",
  "origin": "Karachi",
  "destination": "Berlin",
  "status": "In Transit",
  "slaDeadline": "2026-06-12T18:00:00Z",
  "estimatedDelivery": "2026-06-13T10:00:00Z",
  "delayHours": 16,
  "priority": "High",
  "riskScore": 90,
  "riskLevel": "Critical",
  "slaBreachProbability": 88,
  "confidenceScore": 84
}
```

---

## Carriers

```json
{
  "name": "DHL",
  "averageDelayHours": 5,
  "onTimeRate": 86
}
```

---

## Alerts

```json
{
  "shipmentId": "PK123",
  "riskLevel": "Critical",
  "reason": "Likely SLA breach",
  "recommendedAction": "Escalate carrier",
  "status": "Open"
}
```

---

## Agent Logs

```json
{
  "userQuery": "Which shipments are at risk today?",
  "steps": [
    "Fetched shipments",
    "Calculated risk",
    "Simulated actions"
  ]
}
```

---

## Human Decisions

```json
{
  "shipmentId": "PK123",
  "actionRecommended": "Escalate carrier",
  "actionApproved": true,
  "approvedBy": "Operations Manager"
}
```

---

# Risk Scoring Model

```txt
If estimatedDelivery > slaDeadline      +40
If delayHours > 12                      +30
If carrier onTimeRate < 80              +20
If priority = High                      +10
If attempts >= 2                        +10
If routeRisk = High                     +10
```

Maximum:

```txt
100
```

### Risk Levels

```txt
0-30     Low
31-60    Medium
61-80    High
81-100   Critical
```

---

# Agent Workflow

User asks:

> Which shipments may miss SLA today?

### Flow

1. Understand user intent
2. Fetch active shipments
3. Fetch carrier performance
4. Calculate risk score
5. Calculate SLA breach probability
6. Run simulations
7. Compare interventions
8. Generate explanation using Gemini
9. Present recommendations
10. Request human approval if needed
11. Save logs and alerts

---

# API Endpoints

## Shipments

```http
GET /api/shipments
GET /api/shipments/:trackingNumber
```

## Carriers

```http
GET /api/carriers
```

## Alerts

```http
GET /api/alerts
POST /api/alerts
PATCH /api/alerts/:id/status
```

## Agent

```http
POST /api/agent/query
POST /api/agent/analyze-risk
GET /api/agent/logs
```

## Scenarios

```http
POST /api/scenarios/run
```

## Decisions

```http
POST /api/human-decisions
```

---

# Frontend Pages

## Dashboard

Displays:

- Total Shipments
- Delayed Shipments
- High Risk Shipments
- Critical Shipments
- Open Alerts
- Carrier Performance
- Recent Recommendations

---

## Agent Chat

Example prompts:

- Which shipments may miss SLA today?
- What happens if we do nothing?
- Compare escalation vs backup carrier.
- Which shipment should we prioritize?

---

## Shipments

Displays:

- Tracking Number
- Carrier
- Status
- Risk Level
- SLA Probability
- Confidence

---

## Alerts

Displays:

- Shipment
- Risk
- Reason
- Recommendation
- Approval Status

---

## Decision Logs

Displays:

- Query
- Reasoning
- Confidence
- Recommendation
- Human Decision

---

# MongoDB MCP Usage

MongoDB MCP is used for:

- Reading shipment records
- Reading carrier performance
- Creating alerts
- Storing agent logs
- Maintaining operational memory

---

# Demo Flow

### Step 1

Show dashboard.

### Step 2

Ask:

```txt
Which shipments may miss SLA today?
```

### Step 3

Display:

- Risk scores
- SLA probability
- Confidence
- Scenario comparisons

### Step 4

Show human approval workflow.

### Step 5

Show MongoDB:

- Shipments
- Alerts
- Agent Logs
- Human Decisions

### Step 6

Demonstrate audit trail.

---

# Expected Impact

LogiMind AI helps logistics teams:

- Detect risks earlier
- Reduce SLA violations
- Improve operational efficiency
- Prioritize interventions
- Increase transparency
- Maintain accountability

---

# Final Positioning

LogiMind AI is a predictive logistics decision-support agent that forecasts SLA failures, simulates intervention strategies, explains uncertainty, and supports human-approved operational decisions using Gemini, MongoDB Atlas, Google Cloud Agent Builder, and MongoDB MCP.