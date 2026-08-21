import assert from "node:assert/strict";
import test from "node:test";
import {
  APP_ROLES,
  getAuthenticatedHomePath,
  normalizeAppRole,
} from "../lib/auth/roles.ts";

test("normalizes database role variants without elevating USER", () => {
  assert.equal(normalizeAppRole("ADMIN"), APP_ROLES.ADMIN);
  assert.equal(normalizeAppRole("Admin"), APP_ROLES.ADMIN);
  assert.equal(normalizeAppRole("USER"), APP_ROLES.USER);
  assert.equal(normalizeAppRole("User"), APP_ROLES.USER);
  assert.equal(normalizeAppRole("GROCERY"), undefined);
});

test("routes authenticated users to the correct home", () => {
  assert.equal(
    getAuthenticatedHomePath(APP_ROLES.ADMIN, false),
    "/admin/dashboard",
  );
  assert.equal(
    getAuthenticatedHomePath(APP_ROLES.USER, false),
    "/setup/business",
  );
  assert.equal(
    getAuthenticatedHomePath(APP_ROLES.USER, true),
    "/app/dashboard",
  );
});
