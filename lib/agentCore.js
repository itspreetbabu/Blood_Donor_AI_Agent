// ============================================================
//  lib/agentCore.js — Full 6-Step Autonomous Agent Loop
// ============================================================

import { analyzeAllInventory, getSystemStatus } from "./inventoryAnalyzer.js";
import { matchDonors, markNotified } from "./donorMatcher.js";
import { identifyDriveZones } from "./geoUtils.js";

/**
 * Run the full autonomous agent loop.
 */
export function runAgent({ inventory, donors, emergencyRequest, hospitalLocation }) {
  const log = [];
  const timestamp = new Date().toISOString();
  
  log.push({ step: 0, action: "AGENT_INITIALIZED", message: `Agent starting cycle at ${timestamp}` });

  // ── STEP 1: Analyze Inventory ──────────────────────────────
  const analyzedInventory = analyzeAllInventory(inventory);
  const systemStatus = getSystemStatus(analyzedInventory);
  log.push({ 
    step: 1, 
    action: "ANALYZE_INVENTORY", 
    result: `System status: ${systemStatus}`, 
    details: `${analyzedInventory.length} groups analyzed.` 
  });

  // ── STEP 2: Predict Shortages ──────────────────────────────
  // Include WARNING, CRITICAL, and PREDICTED_SHORTAGE for matching
  const shortageGroups = analyzedInventory.filter((i) => 
    i.predicted_shortage || i.risk === "CRITICAL" || i.risk === "WARNING"
  );
  
  log.push({ 
    step: 2, 
    action: "PREDICT_SHORTAGES", 
    result: `${shortageGroups.length} groups requiring attention.`,
    groups: shortageGroups.map(g => g.blood_group)
  });

  // Merge emergency request into priority list
  let priorityGroups = [...shortageGroups];
  if (emergencyRequest) {
    const alreadyListed = priorityGroups.some((g) => g.blood_group === emergencyRequest.blood_group);
    if (!alreadyListed) {
      const emergencyGroup = analyzedInventory.find((g) => g.blood_group === emergencyRequest.blood_group);
      if (emergencyGroup) priorityGroups.push(emergencyGroup);
    }
    log.push({ 
      step: 2, 
      action: "EMERGENCY_OVERRIDE", 
      result: `Urgent request for ${emergencyRequest.blood_group}`,
      priority: "CRITICAL" 
    });
  }

  // ── STEP 3: Decision Making ────────────────────────────────
  let recommended_action = "Inventory stable. Continuous monitoring active.";
  let should_notify = false;

  if (systemStatus === "SAFE" && priorityGroups.length === 0 && !emergencyRequest) {
    log.push({ step: 3, action: "DECISION_GATE", result: "Status SAFE. No outreach required." });
  } else if (systemStatus === "WARNING" && !emergencyRequest) {
    should_notify = true; // Still match but use warning tone
    recommended_action = "Prepare donor outreach for groups approaching threshold.";
    log.push({ step: 3, action: "DECISION_GATE", result: "Status WARNING. Preparing donor list." });
  } else {
    should_notify = true;
    recommended_action = `CRITICAL: Immediate outreach and donation drive required for ${priorityGroups.map(g => g.blood_group).join(", ")}.`;
    log.push({ step: 3, action: "DECISION_GATE", result: "Status CRITICAL/EMERGENCY. Triggering outreach." });
  }

  // ── STEP 4: Donor Matching ─────────────────────────────────
  const allMatchedDonors = [];
  const loc = emergencyRequest?.hospital_location || hospitalLocation;

  if (should_notify) {
    log.push({ step: 4, action: "DONOR_MATCHING", details: `Searching for donors near hospital (${loc.lat}, ${loc.lng})` });
    
    for (const group of priorityGroups) {
      const matched = matchDonors(group.blood_group, loc, donors, 5);
      allMatchedDonors.push(...matched);
      log.push({ 
        step: 4, 
        action: "MATCH_RESULT", 
        blood_group: group.blood_group, 
        found: matched.length,
        top_donor: matched[0]?.name || "None"
      });
    }
  }

  // De-duplicate donors
  const seen = new Set();
  const uniqueMatched = allMatchedDonors.filter((d) => {
    if (seen.has(d.donor_id)) return false;
    seen.add(d.donor_id);
    return true;
  });

  // ── STEP 5: Action Execution ───────────────────────────────
  let notifications_sent = false;
  let updatedDonors = [...donors];
  let drive_recommendations = [];

  if (should_notify && uniqueMatched.length > 0) {
    notifications_sent = true;
    updatedDonors = markNotified(uniqueMatched, donors);
    drive_recommendations = identifyDriveZones(donors);
    
    uniqueMatched.forEach((d) => {
      log.push({
        step: 5,
        action: "SEND_NOTIFICATION",
        recipient: d.name,
        message: `Urgent need for ${d.blood_group}`
      });
    });

    if (drive_recommendations.length > 0) {
      log.push({
        step: 5,
        action: "DRIVE_RECOMMENDATION",
        locations: drive_recommendations.length
      });
    }
  } else {
    log.push({ step: 5, action: "NOTIFICATION_SKIPPED", reason: "No eligible donors found or outreach not required." });
  }

  // ── STEP 6: Learning ───────────────────────────────────────
  const learningUpdates = uniqueMatched.map((d) => ({
    donor_id: d.donor_id,
    new_priority: d.computed_priority,
  }));
  log.push({ step: 6, action: "LEARNING_LOOP", result: `Updated ${learningUpdates.length} priority scores.` });

  return {
    timestamp,
    status: systemStatus,
    predicted_shortage: priorityGroups.length > 0,
    shortage_groups: priorityGroups.map((g) => ({
      blood_group: g.blood_group,
      current_units: g.current_units,
      minimum_required_units: g.minimum_required_units,
      risk: g.risk,
      days_remaining: g.days_remaining,
    })),
    recommended_action,
    matched_donors: uniqueMatched.map((d) => ({
      donor_id: d.donor_id,
      name: d.name,
      blood_group: d.blood_group,
      distance_km: d.distance_km,
      priority_score: d.computed_priority,
      days_since_donation: d.days_since_donation,
      availability_status: d.availability_status,
    })),
    notifications_sent,
    drive_recommendations,
    agent_log: log,
    updated_donors: updatedDonors,
    analyzed_inventory: analyzedInventory,
  };
}
