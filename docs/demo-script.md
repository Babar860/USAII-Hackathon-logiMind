# LogiMind AI - 3-5 Minute Pitch and Demo Script

Target duration: approximately 4 minutes 15 seconds.

## 0:00-0:30 - Hook: the problem

"When an essential shipment is delayed, the real cost is not only transportation. A clinic, relief team or public program may be left without the resources it needs. Operations teams often see fragmented status data, but they still have to decide which risk is urgent, what intervention will help, and whether the cost is justified. LogiMind AI turns those signals into transparent, human-controlled decisions."

## 0:30-1:20 - Solution and AI approach

Show the Dashboard.

"LogiMind is a decision-support control tower. It combines deterministic SLA risk scoring with an AI reasoning boundary. The system uses delivery estimates, deadlines, delay hours, carrier reliability, priority, failed attempts and route risk. It ranks shipments by risk and breach probability, then shows confidence and the exact factors behind each score. This is designed for accountable public-system and essential-supply decisions, not autonomous execution."

Point to the active role and integration summary.

"The active role is visible. Operators can analyze and manage alerts, while only approvers and administrators can authorize controlled interventions. The current demo also reports whether MongoDB, Gemini and the local agent path are active."

## 1:20-2:55 - Working demo

1. Show the Shipment Risk Queue and select `PK123`.
2. Point out risk level, breach probability, confidence and factors.
3. Open Scenario Simulation.
4. Compare Do Nothing, Escalate Carrier and Assign Backup Carrier.
5. Open Agent Chat and ask: `Which shipments may miss SLA today?`

Say:

"The scenario engine compares expected risk, delay reduction, cost and confidence. The agent receives structured evidence rather than guessing from a vague prompt. In this verified run, Google Agent Runtime is not configured and Gemini is optional, so the deterministic fallback produces an operations-ready explanation. That graceful degradation is intentional: unavailable cloud infrastructure must not make a protection or public-service decision tool disappear."

6. Show Human Approval.
7. Reject or approve one recommendation.
8. Open Decisions and show the audit record.

"The AI never executes this action. An Operations Manager makes the decision, and LogiMind records the recommendation, confidence, actor and outcome."

## 2:55-3:40 - Responsible AI and limitations

"The central risk is acting on incomplete or incorrect data. Our mitigation is concrete: show the evidence, expose confidence and missing information, forbid invented shipment facts, and require human approval for critical, expensive or uncertain actions. We use synthetic data and claim no production accuracy. The next validation step is working with domain partners to calibrate weights and monitor fairness and drift."

Show the integration status or README disclosure.

"We also configured and tested the LogiMind role in Google Cloud Agent Studio. Runtime deployment required billing we could not enable, so we do not claim a deployed Google agent or Agent ID. The Preview worked, and the local fallback shown here is the submitted working agent."

## 3:40-4:15 - Impact and close

"LogiMind helps teams move from reactive dashboards to transparent intervention choices. It can support essential-supply networks, humanitarian logistics and public programs where delays affect communities. The key idea is simple: AI should identify risk and clarify tradeoffs, while accountable people retain authority. LogiMind keeps the system useful, explainable and operational even when cloud AI is unavailable."

End on the Dashboard with the project name visible.

## Recording checklist

- Keep the browser zoom readable.
- Hide API keys, database strings, personal bookmarks and notifications.
- Do one uninterrupted rehearsal before recording.
- Keep final duration between 3:00 and 5:00.
- Upload publicly and test the URL while signed out.
