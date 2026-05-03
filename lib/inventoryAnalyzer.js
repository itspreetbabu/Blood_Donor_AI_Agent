// ============================================================
//  lib/inventoryAnalyzer.js — Step 1 & 2 of Agent Logic
// ============================================================

/**
 * Analyze a single blood group inventory entry.
 * Returns { risk, predicted_shortage, days_remaining }
 */
export function analyzeInventory(item) {
  const { current_units, minimum_required_units, daily_usage_rate } = item;

  // Risk classification
  let risk;
  if (current_units >= minimum_required_units) {
    risk = "SAFE";
  } else if (current_units >= minimum_required_units * 0.75) {
    risk = "WARNING";
  } else {
    risk = "CRITICAL";
  }

  // Shortage prediction: will we hit minimum in 2 days?
  const units_after_2_days = current_units - daily_usage_rate * 2;
  const predicted_shortage = units_after_2_days < minimum_required_units;

  // Days remaining before hitting zero
  const days_remaining = daily_usage_rate > 0
    ? Math.max(0, Math.floor(current_units / daily_usage_rate))
    : Infinity;

  return { risk, predicted_shortage, days_remaining };
}

/**
 * Analyze entire inventory array.
 * Returns array of enriched inventory objects.
 */
export function analyzeAllInventory(inventory) {
  return inventory.map((item) => ({
    ...item,
    ...analyzeInventory(item),
  }));
}

/**
 * Returns the aggregate system status (worst-case across all blood groups).
 */
export function getSystemStatus(analyzedInventory) {
  const statuses = analyzedInventory.map((i) => i.risk);
  if (statuses.includes("CRITICAL")) return "CRITICAL";
  if (statuses.includes("WARNING"))  return "WARNING";
  return "SAFE";
}
