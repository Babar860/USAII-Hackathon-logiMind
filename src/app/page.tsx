"use client";

import axios from "axios";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { AgentAnalysis, AgentLog, Alert, Carrier, EnrichedShipment, HumanDecision, ScenarioResult } from "@/lib/types";
import { alerts as seedAlerts, carriers as seedCarriers, humanDecisions, shipments } from "@/lib/data";
import { calculateRisk } from "@/lib/risk";
import { recommendedScenario, runScenarios } from "@/lib/scenarios";

const carrierLookup = new Map(seedCarriers.map((carrier) => [carrier.name, carrier]));
const enrichedShipments = shipments.map((shipment) => calculateRisk(shipment, carrierLookup.get(shipment.carrier)));

const navItems = ["Dashboard", "Shipments", "Alerts", "Agent Chat", "Decisions"] as const;
type View = (typeof navItems)[number];

function riskClass(level: string) {
  return level.toLowerCase();
}

function Metric({ label, value, detail, tone }: { label: string; value: string | number; detail: string; tone: string }) {
  return (
    <section className={`metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </section>
  );
}

function StatusDot({ tone }: { tone: string }) {
  return <span className={`status-dot ${tone}`} aria-hidden="true" />;
}

function ShipmentsTable({ rows, onSelect }: { rows: EnrichedShipment[]; onSelect: (shipment: EnrichedShipment) => void }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tracking</th>
            <th>Lane</th>
            <th>Carrier</th>
            <th>Status</th>
            <th>Risk</th>
            <th>SLA %</th>
            <th>Conf.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((shipment) => (
            <tr key={shipment.trackingNumber} onClick={() => onSelect(shipment)}>
              <td>
                <strong>{shipment.trackingNumber}</strong>
              </td>
              <td>
                {shipment.origin} to {shipment.destination}
              </td>
              <td>{shipment.carrier}</td>
              <td>{shipment.status}</td>
              <td>
                <span className={`risk-pill ${riskClass(shipment.riskLevel)}`}>{shipment.riskLevel}</span>
              </td>
              <td>{shipment.slaBreachProbability}%</td>
              <td>{shipment.confidenceScore}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CarrierPerformance({ rows }: { rows: Carrier[] }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>Carrier Performance</h2>
          <p>On-time rate and active shipment load</p>
        </div>
      </div>
      <div className="carrier-list">
        {rows.map((carrier) => (
          <div className="carrier-row" key={carrier.name}>
            <div>
              <strong>{carrier.name}</strong>
              <span>{carrier.averageDelayHours}h avg delay</span>
            </div>
            <div className="bar" aria-label={`${carrier.name} on-time rate ${carrier.onTimeRate}%`}>
              <span style={{ width: `${carrier.onTimeRate}%` }} />
            </div>
            <b>{carrier.onTimeRate}%</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScenarioPanel({ shipment, scenarios }: { shipment: EnrichedShipment; scenarios: ScenarioResult[] }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>Scenario Simulation</h2>
          <p>{shipment.trackingNumber} intervention comparison</p>
        </div>
      </div>
      <div className="scenario-list">
        {scenarios.map((scenario) => (
          <article className="scenario" key={scenario.action}>
            <div>
              <strong>{scenario.action}</strong>
              <span>{scenario.estimatedDelayReductionHours}h delay reduction</span>
            </div>
            <div>
              <b>{scenario.newRiskScore}</b>
              <span>risk</span>
            </div>
            <div>
              <b>${scenario.costImpact}</b>
              <span>cost</span>
            </div>
            <div>
              <b>{scenario.confidence}%</b>
              <span>confidence</span>
            </div>
            {scenario.requiresApproval ? <em>Approval</em> : <em className="clear">Ready</em>}
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("Dashboard");
  const [query, setQuery] = useState("Which shipments may miss SLA today?");
  const [agentAnswer, setAgentAnswer] = useState("");
  const [agentProvider, setAgentProvider] = useState("Deterministic fallback");
  const [integrationSummary, setIntegrationSummary] = useState("Checking integrations");
  const [selectedShipment, setSelectedShipment] = useState(enrichedShipments[0]);
  const [shipmentRows, setShipmentRows] = useState<EnrichedShipment[]>(enrichedShipments);
  const [carrierRows, setCarrierRows] = useState<Carrier[]>(seedCarriers);
  const [alertRows, setAlertRows] = useState<Alert[]>(seedAlerts);
  const [decisionRows, setDecisionRows] = useState<HumanDecision[]>(humanDecisions);
  const [logs, setLogs] = useState<AgentLog[]>([]);

  const sortedShipments = useMemo(() => shipmentRows.toSorted((a, b) => b.riskScore - a.riskScore), [shipmentRows]);
  const atRisk = sortedShipments.filter((shipment) => shipment.riskLevel === "High" || shipment.riskLevel === "Critical");
  const critical = sortedShipments.filter((shipment) => shipment.riskLevel === "Critical");
  const delayed = sortedShipments.filter((shipment) => shipment.status === "Delayed");
  const scenarios = useMemo(() => runScenarios(selectedShipment), [selectedShipment]);
  const recommendation = recommendedScenario(selectedShipment);
  const recentRecommendations = atRisk.slice(0, 3).map((shipment) => ({
    shipment,
    scenario: recommendedScenario(shipment)
  }));

  useEffect(() => {
    let active = true;
    async function loadDashboardData() {
      try {
        const [shipmentsResponse, carriersResponse, alertsResponse, decisionsResponse, logsResponse, statusResponse] = await Promise.all([
          axios.get<EnrichedShipment[]>("/api/shipments"),
          axios.get<Carrier[]>("/api/carriers"),
          axios.get<Alert[]>("/api/alerts"),
          axios.get<HumanDecision[]>("/api/human-decisions"),
          axios.get<AgentLog[]>("/api/agent/logs"),
          axios.get("/api/integrations/status")
        ]);
        if (!active) return;
        setShipmentRows(shipmentsResponse.data);
        setCarrierRows(carriersResponse.data);
        setAlertRows(alertsResponse.data);
        setDecisionRows(decisionsResponse.data);
        setLogs(logsResponse.data);
        setSelectedShipment(shipmentsResponse.data[0] ?? enrichedShipments[0]);
        const data = statusResponse.data;
        const mongo = data.mongodb?.connected ? "MongoDB connected" : "Memory mode";
        const gemini = data.gemini?.configured ? "Gemini ready" : "Gemini fallback";
        setIntegrationSummary(`${mongo} | ${gemini}`);
      } catch {
        if (active) setIntegrationSummary("Integration status unavailable");
      }
    }
    void loadDashboardData();
    return () => {
      active = false;
    };
  }, []);

  async function handleAgentQuery(event?: FormEvent) {
    event?.preventDefault();
    const { data } = await axios.post<AgentAnalysis>("/api/agent/query", { query });
    setSelectedShipment(data.topShipment);
    setAgentAnswer(data.answer);
    setAgentProvider(data.modelProvider);
    setLogs((current) => [data.log, ...current]);
    setAlertRows((current) => {
      const exists = current.some((alert) => alert.shipmentId === data.topShipment.trackingNumber && alert.status !== "Resolved");
      if (exists) return current;
      return [
        {
          id: `ALT-${1000 + current.length + 1}`,
          shipmentId: data.topShipment.trackingNumber,
          riskLevel: data.topShipment.riskLevel,
          reason: `${data.topShipment.riskLevel} SLA miss risk`,
          recommendedAction: data.recommendation.action,
          status: "Open"
        },
        ...current
      ];
    });
  }

  async function approveRecommendation(approved: boolean) {
    const { data: record } = await axios.post<HumanDecision>("/api/human-decisions", {
      shipmentId: selectedShipment.trackingNumber,
      actionRecommended: recommendation.action,
      actionApproved: approved,
      approvedBy: "Operations Manager"
    });
    setDecisionRows((current) => [record, ...current]);
    setAlertRows((current) =>
      current.map((alert) =>
        alert.shipmentId === selectedShipment.trackingNumber ? { ...alert, status: approved ? "Acknowledged" : "Open" } : alert
      )
    );
  }

  const mainContent = {
    Dashboard: (
      <>
        <div className="metrics-grid">
          <Metric label="Total Shipments" value={sortedShipments.length} detail="Active network load" tone="blue" />
          <Metric label="Delayed" value={delayed.length} detail="Need recovery action" tone="amber" />
          <Metric label="High Risk" value={atRisk.length} detail="High or critical SLA risk" tone="red" />
          <Metric label="Critical" value={critical.length} detail="Approval required" tone="crimson" />
          <Metric label="Open Alerts" value={alertRows.filter((alert) => alert.status === "Open").length} detail="Unresolved operations alerts" tone="teal" />
        </div>
        <div className="main-grid">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Shipment Risk Queue</h2>
                <p>Prioritized by deterministic SLA failure score</p>
              </div>
              <button onClick={() => setView("Shipments")}>View all</button>
            </div>
            <ShipmentsTable rows={sortedShipments.slice(0, 5)} onSelect={setSelectedShipment} />
          </section>
          <div className="side-stack">
            <CarrierPerformance rows={carrierRows} />
            <AgentPanel query={query} setQuery={setQuery} answer={agentAnswer} onSubmit={handleAgentQuery} />
          </div>
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Recent Recommendations</h2>
                <p>Confidence-aware next best actions</p>
              </div>
            </div>
            <div className="recommendation-list">
              {recentRecommendations.map(({ shipment, scenario }) => (
                <article className="recommendation" key={shipment.trackingNumber}>
                  <StatusDot tone={riskClass(shipment.riskLevel)} />
                  <div>
                    <strong>{shipment.trackingNumber}</strong>
                    <span>{scenario.action}</span>
                  </div>
                  <b>{scenario.confidence}%</b>
                </article>
              ))}
            </div>
          </section>
          <ScenarioPanel shipment={selectedShipment} scenarios={scenarios} />
        </div>
      </>
    ),
    Shipments: (
      <section className="panel full">
        <div className="panel-head">
          <div>
            <h2>Shipments</h2>
            <p>Risk, probability, confidence, and lane status</p>
          </div>
        </div>
        <ShipmentsTable rows={sortedShipments} onSelect={setSelectedShipment} />
      </section>
    ),
    Alerts: (
      <section className="panel full">
        <div className="panel-head">
          <div>
            <h2>Alerts</h2>
            <p>Operational issues requiring review</p>
          </div>
        </div>
        <div className="alert-list">
          {alertRows.map((alert) => (
            <article className="alert-row" key={alert.id}>
              <StatusDot tone={riskClass(alert.riskLevel)} />
              <div>
                <strong>{alert.shipmentId}</strong>
                <span>{alert.reason}</span>
              </div>
              <b>{alert.recommendedAction}</b>
              <button
                onClick={async () => {
                  const { data } = await axios.patch<Alert>(`/api/alerts/${alert.id}/status`, { status: "Resolved" });
                  setAlertRows((rows) => rows.map((row) => (row.id === alert.id ? data : row)));
                }}
              >
                {alert.status}
              </button>
            </article>
          ))}
        </div>
      </section>
    ),
    "Agent Chat": (
      <div className="main-grid">
        <AgentPanel query={query} setQuery={setQuery} answer={agentAnswer} onSubmit={handleAgentQuery} large />
        <ScenarioPanel shipment={selectedShipment} scenarios={scenarios} />
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Human Approval</h2>
              <p>{recommendation.requiresApproval ? "Approval required before execution" : "Recommendation can proceed"}</p>
            </div>
          </div>
          <div className="approval">
            <strong>{recommendation.action}</strong>
            <span>{selectedShipment.trackingNumber} has {selectedShipment.confidenceScore}% confidence and {selectedShipment.riskLevel.toLowerCase()} risk.</span>
            <div>
              <button onClick={() => void approveRecommendation(true)}>Approve</button>
              <button className="secondary" onClick={() => void approveRecommendation(false)}>Reject</button>
            </div>
          </div>
        </section>
      </div>
    ),
    Decisions: (
      <section className="panel full">
        <div className="panel-head">
          <div>
            <h2>Decision Logs</h2>
            <p>Audit trail for recommendations and human outcomes</p>
          </div>
        </div>
        <div className="decision-list">
          {decisionRows.map((decision) => (
            <article className="decision" key={decision.id}>
              <strong>{decision.shipmentId}</strong>
              <span>{decision.actionRecommended}</span>
              <b>{decision.actionApproved ? "Approved" : "Rejected"}</b>
              <small>{decision.approvedBy}</small>
            </article>
          ))}
          {logs.map((log) => (
            <article className="decision" key={log.id}>
              <strong>{log.shipmentIds[0] ?? "Agent Log"}</strong>
              <span>{log.reasoning}</span>
              <b>{log.humanDecision}</b>
              <small>{log.confidenceScore}% confidence</small>
            </article>
          ))}
        </div>
      </section>
    )
  } satisfies Record<View, React.ReactNode>;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">L</div>
          <div>
            <strong>LogiMind AI</strong>
            <span>Control tower</span>
          </div>
        </div>
        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <button className={view === item ? "active" : ""} key={item} onClick={() => setView(item)}>
              {item}
            </button>
          ))}
        </nav>
        <section className="sidebar-status">
          <span>Model guardrails</span>
          <strong>Human approval active</strong>
          <small>Critical risk, low confidence, and high-cost actions require review. Current reasoning: {agentProvider}.</small>
        </section>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>{view}</h1>
            <p>Predict SLA failures, simulate interventions, and keep decisions auditable. {integrationSummary}</p>
          </div>
          <div className="topbar-actions">
            <button onClick={() => void handleAgentQuery()}>Run risk analysis</button>
          </div>
        </header>
        {mainContent[view]}
      </section>
    </main>
  );
}

function AgentPanel({
  query,
  setQuery,
  answer,
  onSubmit,
  large = false
}: {
  query: string;
  setQuery: (value: string) => void;
  answer: string;
  onSubmit: (event?: FormEvent) => void;
  large?: boolean;
}) {
  const prompts = ["Which shipments may miss SLA today?", "What happens if we do nothing?", "Compare escalation vs backup carrier."];

  return (
    <section className={`panel agent-panel ${large ? "span-2" : ""}`}>
      <div className="panel-head">
        <div>
          <h2>Agent Chat</h2>
          <p>Ask operational risk questions in natural language</p>
        </div>
      </div>
      <form onSubmit={onSubmit}>
        <textarea value={query} onChange={(event) => setQuery(event.target.value)} rows={large ? 5 : 3} />
        <button type="submit">Ask agent</button>
      </form>
      <div className="prompt-row">
        {prompts.map((prompt) => (
          <button key={prompt} onClick={() => setQuery(prompt)}>
            {prompt}
          </button>
        ))}
      </div>
      <div className="agent-answer">
        <span>{answer || "The agent will fetch shipments, calculate risk, run scenarios, and return confidence-aware recommendations."}</span>
        <small>Reasoning: {large ? "Gemini when configured, deterministic fallback otherwise" : "API-backed"}</small>
      </div>
    </section>
  );
}
