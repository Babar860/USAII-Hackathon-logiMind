import assert from "node:assert/strict";
import test from "node:test";
import { hasPermission, resolveAppRole } from "./roles";

test("development defaults to an approver for the complete local demo", () => {
  assert.equal(resolveAppRole(undefined, false), "approver");
});

test("production fails closed to a viewer when no role is configured", () => {
  assert.equal(resolveAppRole(undefined, true), "viewer");
  assert.equal(resolveAppRole("invalid", true), "viewer");
});

test("only approver and admin roles can approve decisions", () => {
  assert.equal(hasPermission("viewer", "decisions:approve"), false);
  assert.equal(hasPermission("operator", "decisions:approve"), false);
  assert.equal(hasPermission("approver", "decisions:approve"), true);
  assert.equal(hasPermission("admin", "decisions:approve"), true);
});
