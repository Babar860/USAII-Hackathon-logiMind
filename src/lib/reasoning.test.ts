import assert from "node:assert/strict";
import test from "node:test";
import { carriers, shipments } from "./data";
import { buildOperationalPrompt, LOGIMIND_AGENT_ROLE } from "./reasoning";
import { calculateRisk } from "./risk";
import { recommendedScenario, runScenarios } from "./scenarios";

test("agent role preserves human approval and no-execution boundaries", () => {
  assert.match(LOGIMIND_AGENT_ROLE, /Never execute an operational action/);
  assert.match(LOGIMIND_AGENT_ROLE, /authorized human approver/);
  assert.match(LOGIMIND_AGENT_ROLE, /Never invent shipment data/);
});

test("operational prompt includes supplied evidence and the user query", () => {
  const topShipment = calculateRisk(shipments[0], carriers.find((carrier) => carrier.name === shipments[0].carrier));
  const scenarios = runScenarios(topShipment);
  const prompt = buildOperationalPrompt({
    userQuery: "Which shipment is most at risk?",
    atRisk: [topShipment],
    topShipment,
    scenarios,
    recommendation: recommendedScenario(topShipment)
  });

  assert.match(prompt, /Which shipment is most at risk\?/);
  assert.match(prompt, new RegExp(topShipment.trackingNumber));
  assert.match(prompt, /Scenario comparisons/);
});
