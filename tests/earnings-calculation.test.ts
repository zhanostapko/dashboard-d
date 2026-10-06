import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateCommission,
  calculateWorkTotal,
  calculateWorkerCommission,
  sumWorkerRates,
  validateWorkerRateSum,
} from "../modules/repairs/commission.ts";

test("calculates the commission base from work items only", () => {
  const items = [
    { unit: "work" as const, quantity: 2, price: 250 },
    { unit: "materials" as const, quantity: 1, price: 900 },
  ];

  assert.equal(calculateWorkTotal(items), 500);
  assert.equal(calculateWorkerCommission(items, 60), 300);
});

test("calculates multiple workers from the same work total", () => {
  assert.equal(calculateCommission(1000, 60), 600);
  assert.equal(calculateCommission(1000, 40), 400);
});

test("accepts exactly 100 percent and rejects overflow", () => {
  assert.equal(sumWorkerRates([60, 40]), 100);
  assert.equal(validateWorkerRateSum([60, 40]), true);
  assert.equal(validateWorkerRateSum([60, 41]), false);
});

test("rounds calculated commission to cents", () => {
  assert.equal(calculateCommission(123.45, 33.33), 41.15);
});
