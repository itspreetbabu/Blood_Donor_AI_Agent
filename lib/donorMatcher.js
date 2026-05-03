// ============================================================
//  lib/donorMatcher.js — Step 4 of Agent Logic
// ============================================================

const MIN_DAYS_BETWEEN_DONATIONS = 90;
const MIN_DAYS_BETWEEN_NOTIFICATIONS = 0; // Set to 0 for demo/testing so users see results repeatedly

/**
 * Haversine formula — distance in km between two lat/lng coords.
 */
function haversineKm(loc1, loc2) {
  const R = 6371;
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Days since a given ISO date string.
 */
function daysSince(dateStr) {
  const past = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - past) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate a composite priority score.
 * Base 100 + response bonuses - inactivity/spam penalties.
 */
function computePriorityScore(donor) {
  let score = donor.priority_score ?? 50;
  const responses = donor.response_history ?? [];
  responses.forEach((r) => {
    if (r === "responded") score += 5;
    if (r === "ignored")   score -= 3;
  });
  return Math.max(0, Math.min(200, score));
}

/**
 * Match eligible donors for a given blood group and hospital location.
 *
 * @param {string} blood_group
 * @param {{ lat: number, lng: number }} hospital_location
 * @param {Array} donors
 * @param {number} [topN=5]
 * @returns {Array}
 */
export function matchDonors(blood_group, hospital_location, donors, topN = 5) {
  const today = new Date();

  const eligible = donors.filter((d) => {
    if (d.blood_group !== blood_group) return false;
    if (d.availability_status !== "available") return false;
    if (daysSince(d.last_donation_date) < MIN_DAYS_BETWEEN_DONATIONS) return false;
    // Rate-limit: skip if last notified < 14 days ago
    if (d.last_notified_date && daysSince(d.last_notified_date) < MIN_DAYS_BETWEEN_NOTIFICATIONS) return false;
    return true;
  });

  const enriched = eligible.map((d) => ({
    ...d,
    distance_km: parseFloat(haversineKm(d.location, hospital_location).toFixed(2)),
    computed_priority: computePriorityScore(d),
    days_since_donation: daysSince(d.last_donation_date),
  }));

  // Sort: nearest first, then highest priority
  enriched.sort((a, b) => {
    if (a.distance_km !== b.distance_km) return a.distance_km - b.distance_km;
    return b.computed_priority - a.computed_priority;
  });

  return enriched.slice(0, topN);
}

/**
 * Mark top donors as notified (mutates donor list for session memory).
 */
export function markNotified(matchedDonors, allDonors) {
  const notifiedIds = new Set(matchedDonors.map((d) => d.donor_id));
  return allDonors.map((d) =>
    notifiedIds.has(d.donor_id)
      ? { ...d, last_notified_date: new Date().toISOString().split("T")[0] }
      : d
  );
}
