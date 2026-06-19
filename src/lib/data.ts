import type { Alert, Carrier, HumanDecision, Shipment } from "./types";

export const carriers: Carrier[] = [
  { name: "DHL", averageDelayHours: 5, onTimeRate: 86, activeShipments: 41 },
  { name: "FedEx", averageDelayHours: 7, onTimeRate: 78, activeShipments: 37 },
  { name: "UPS", averageDelayHours: 4, onTimeRate: 89, activeShipments: 34 },
  { name: "Aramex", averageDelayHours: 9, onTimeRate: 74, activeShipments: 28 },
  { name: "Maersk", averageDelayHours: 11, onTimeRate: 71, activeShipments: 19 }
];

export const shipments: Shipment[] = [
  {
    trackingNumber: "PK123",
    carrier: "DHL",
    origin: "Karachi",
    destination: "Berlin",
    status: "Delayed",
    slaDeadline: "2026-06-19T18:00:00Z",
    estimatedDelivery: "2026-06-20T10:00:00Z",
    delayHours: 16,
    priority: "High",
    attempts: 2,
    routeRisk: "High"
  },
  {
    trackingNumber: "US884",
    carrier: "FedEx",
    origin: "Dallas",
    destination: "Toronto",
    status: "In Transit",
    slaDeadline: "2026-06-19T23:00:00Z",
    estimatedDelivery: "2026-06-20T02:00:00Z",
    delayHours: 7,
    priority: "High",
    attempts: 1,
    routeRisk: "Medium"
  },
  {
    trackingNumber: "DE440",
    carrier: "Aramex",
    origin: "Hamburg",
    destination: "Dubai",
    status: "Delayed",
    slaDeadline: "2026-06-19T20:30:00Z",
    estimatedDelivery: "2026-06-20T14:30:00Z",
    delayHours: 18,
    priority: "Medium",
    attempts: 3,
    routeRisk: "Critical"
  },
  {
    trackingNumber: "CN908",
    carrier: "Maersk",
    origin: "Shenzhen",
    destination: "Los Angeles",
    status: "In Transit",
    slaDeadline: "2026-06-21T10:00:00Z",
    estimatedDelivery: "2026-06-21T11:30:00Z",
    delayHours: 3,
    priority: "Low",
    attempts: 0,
    routeRisk: "High"
  },
  {
    trackingNumber: "GB710",
    carrier: "UPS",
    origin: "Manchester",
    destination: "Paris",
    status: "Out for Delivery",
    slaDeadline: "2026-06-19T17:00:00Z",
    estimatedDelivery: "2026-06-19T16:10:00Z",
    delayHours: 0,
    priority: "Medium",
    attempts: 1,
    routeRisk: "Low"
  },
  {
    trackingNumber: "BR302",
    carrier: "FedEx",
    origin: "Sao Paulo",
    destination: "Miami",
    status: "Pending",
    slaDeadline: "2026-06-20T06:00:00Z",
    estimatedDelivery: "2026-06-20T08:00:00Z",
    delayHours: 9,
    priority: "High",
    attempts: 1,
    routeRisk: "Medium"
  }
];

export const alerts: Alert[] = [
  {
    id: "ALT-1001",
    shipmentId: "PK123",
    riskLevel: "Critical",
    reason: "Likely SLA breach within the next operating window",
    recommendedAction: "Assign Backup Carrier",
    status: "Open"
  },
  {
    id: "ALT-1002",
    shipmentId: "DE440",
    riskLevel: "Critical",
    reason: "Route risk and delay are compounding",
    recommendedAction: "Escalate Carrier",
    status: "Open"
  },
  {
    id: "ALT-1003",
    shipmentId: "US884",
    riskLevel: "High",
    reason: "SLA exposure is rising on a high-priority lane",
    recommendedAction: "Prioritize Warehouse Dispatch",
    status: "Acknowledged"
  }
];

export const humanDecisions: HumanDecision[] = [
  {
    id: "DEC-2401",
    shipmentId: "US884",
    actionRecommended: "Prioritize Warehouse Dispatch",
    actionApproved: true,
    approvedBy: "Operations Manager",
    createdAt: "2026-06-19T10:18:00Z"
  }
];
