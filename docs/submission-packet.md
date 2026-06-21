# LogiMind AI - Submission Packet

Copy these answers into the submission form. Replace every `[REQUIRED]` placeholder before submitting.

## Submission deadline

- Deadline: June 21, 2026 at 11:59 PM ET
- Pakistan equivalent: June 22, 2026 at 8:59 AM PKT (ET is on daylight time)
- Do not wait for the final minutes; verify every public link in a signed-out browser.

## 1. Qualifier approval code

**Qualifier code:** `[REQUIRED - paste the 8-character code emailed June 12]`

Do not invent or omit this value. A submission without the valid code is disqualified.

## 2. Project information

### Project title

**LogiMind AI: Human-Guided Risk Intelligence for Essential Supply Networks**

### Tagline (80 characters maximum)

**Human-guided AI for safer, transparent essential-supply decisions.**

### Description

LogiMind AI is a decision-support control tower for essential supply and logistics networks. Delayed or disrupted shipments can leave communities, clinics, and public programs without critical resources. LogiMind combines deterministic SLA risk scoring with an AI reasoning layer to identify high-risk shipments, explain contributing factors, compare intervention scenarios, and recommend a next action with confidence and cost information.

We built the prototype with Next.js, React, TypeScript, an Express API, MongoDB-ready persistence, the Gemini API boundary, and a deterministic fallback agent. The processing pipeline calculates risk from delivery timing, delay, carrier performance, priority, failed attempts, and route risk. It then simulates interventions such as carrier escalation, customer notification, warehouse prioritization, or assigning a backup carrier. Every analysis creates an auditable log.

Our largest challenges were keeping recommendations explainable, preventing the model from inventing operational facts, and preserving a working demonstration when cloud services were unavailable. We addressed these with structured evidence, deterministic scoring, explicit confidence, role-based permissions, human approval gates, in-memory demo data, and a local fallback reasoning path.

We are proud that the prototype works without production data or paid infrastructure, shows the cost and impact of alternative actions, and never lets the AI approve a controlled intervention. We learned that resilient public-interest AI needs graceful degradation and transparent boundaries as much as model capability.

Next, we would connect authenticated agency data, validate risk weights with domain partners, add fairness and drift monitoring, and deploy the tested Google Agent Studio configuration when a billing-enabled project is available.

### Built With tags

- Next.js 16
- React 19
- TypeScript
- Node.js
- Express
- Gemini API / Google Generative AI SDK
- Google Cloud Agent Studio (preview configuration only)
- MongoDB Atlas adapter
- Axios
- Deterministic risk scoring
- Scenario simulation
- Role-based access control
- Human-in-the-loop approval
- Node test runner / tsx
- Codex coding assistance

## 3. Track and challenge

**Track:** Graduate

**Challenge direction:** Public Systems & Policy - Build AI That Helps Communities Make Better Decisions

**Why this direction fits:** LogiMind models the consequences of inaction, simulates intervention outcomes, supports transparent resource-allocation decisions, and keeps accountable human operators in control. The prototype uses essential-supply logistics as the public-system decision context.

## 4. Design questions

### AI Architecture Explanation (600 characters maximum)

Inputs are shipment records containing route, carrier, status, SLA deadline, estimated arrival, delay, priority and delivery attempts. A deterministic engine calculates risk, breach probability and confidence; a scenario engine models intervention cost and delay reduction. Gemini can turn this structured evidence into concise reasoning. If Gemini or Google Agent Runtime is unavailable, a deterministic agent produces the explanation. Outputs include a ranked risk queue, factors, scenarios, recommendation, confidence and an audit log.

### Human-in-the-Loop Design (500 characters maximum)

LogiMind does not approve or execute rerouting, backup-carrier assignment, expedited shipping or other controlled interventions. These actions can increase cost, move scarce capacity and affect people awaiting essential supplies. The AI presents evidence, alternatives, confidence and uncertainty; only a user with the Operations Manager or Administrator role can approve or reject the recommendation, and that decision is recorded in the audit trail.

### Responsible AI Guardrail (500 characters maximum)

Risk: incorrect or incomplete data could cause LogiMind to rank the wrong shipment as urgent. Mitigation: recommendations show the exact risk factors and confidence, missing data is surfaced, and the agent is instructed never to invent shipment facts. High-cost, critical-risk or low-confidence actions remain pending until an authorized human reviews them. When cloud AI is unavailable, the system degrades to deterministic rules instead of silently failing.

## 5. Tools and data disclosure

### AI Tools Used (800 characters maximum)

Google Gemini through `@google/generative-ai` (API pricing/free-tier availability depends on the account) for evidence-grounded operational explanations. Google Cloud Agent Studio was used to configure and test the LogiMind role; Agent Runtime deployment was not completed because billing could not be enabled, so no runtime Agent ID is claimed. A free local deterministic reasoning engine provides the verified fallback. Next.js, React, TypeScript, Express, MongoDB driver, Axios, Node test runner and tsx are used in the prototype. OpenAI Codex was used for coding assistance, debugging, tests and submission documentation. No paid AI runtime was required for the verified local demo.

### Data Sources (800 characters maximum)

The demonstration uses project-authored synthetic shipment, carrier, alert and decision records stored in `src/lib/data.ts`. Fields include fictional tracking IDs, global origin/destination pairs, carrier performance, SLA times, delays, priority, route risk and delivery attempts. No personal, survivor, medical or production customer data is included. Risk scores and scenarios are computed from transparent project-defined rules in `src/lib/risk.ts` and `src/lib/scenarios.ts`; they are not trained on a private dataset. MongoDB Atlas is an optional persistence layer, but the verified demo uses the same synthetic records in memory when MongoDB is not configured.

## 6. Demo materials

### Pitch video

**Video URL:** `[REQUIRED - public YouTube, Vimeo or Loom link]`

Requirements:

- Duration must be 3-5 minutes.
- Use the structure in [demo-script.md](demo-script.md).
- Confirm the link opens without your account.

### Demo or walkthrough link

**Live app URL:** `[REQUIRED - deployed public URL, if available]`

**GitHub repository:** `[REQUIRED - public repository URL]`

**Documentation/walkthrough:** `[REQUIRED - README or public walkthrough URL]`

`localhost` is not a valid judge-facing demo URL. If a public deployment is unavailable, use the public GitHub README plus the recorded walkthrough.

## Agent runtime disclosure

Use this wording if the form or judges ask about the Google Cloud agent:

> We configured and successfully tested the LogiMind role in Google Cloud Agent Studio Preview. Agent Runtime deployment required billing details that our team could not provide, so no Google Cloud runtime Agent ID is claimed. The submitted application remains fully demonstrable through a local agent pipeline: deterministic risk and scenario engines, optional Gemini reasoning, and a deterministic fallback when cloud AI is unavailable.

Do not say that the cloud agent was unresponsive. The Preview agent responded correctly; deployment was blocked by billing.

## Team information

- Team name: `[REQUIRED]`
- Team members and roles: `[REQUIRED - list every member]`
- Primary contact email: `[REQUIRED]`
- Institution/program: `[REQUIRED if requested]`

## Final checklist

- [ ] Valid 8-character qualifier code entered
- [ ] Project title, tagline and complete description entered
- [ ] Graduate track selected
- [ ] Public Systems & Policy challenge selected
- [ ] All three design answers fit their character limits
- [ ] AI tools and coding assistance fully disclosed
- [ ] Synthetic data source disclosed
- [ ] Video is public and 3-5 minutes
- [ ] Demo, GitHub and documentation links work while signed out
- [ ] All team members are listed
- [ ] Google Agent Runtime limitation is described accurately
- [ ] Final Submit button clicked before the deadline
- [ ] Submission confirmation saved
