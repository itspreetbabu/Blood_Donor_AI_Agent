// ============================================================
//  lib/geoUtils.js — Geospatial Analysis for Donation Drives
// ============================================================

/**
 * Identifies high-density donor areas for donation drives.
 * Rounds coordinates to a 0.01 degree grid (~1km precision).
 * 
 * @param {Array} donors 
 * @returns {Array} List of recommended drive zones
 */
export function identifyDriveZones(donors) {
  const clusters = {};

  donors.forEach((d) => {
    // Round to ~1km precision
    const lat = Math.round(d.location.lat * 100) / 100;
    const lng = Math.round(d.location.lng * 100) / 100;
    const key = `${lat},${lng}`;

    if (!clusters[key]) {
      clusters[key] = {
        lat,
        lng,
        count: 0,
        donors: [],
        blood_groups: new Set(),
      };
    }

    clusters[key].count++;
    clusters[key].donors.push(d.name);
    clusters[key].blood_groups.add(d.blood_group);
  });

  // Convert to array and sort by density
  const recommendations = Object.values(clusters)
    .map((c) => ({
      ...c,
      blood_groups: Array.from(c.blood_groups),
      density_score: c.count,
    }))
    .filter(c => c.count >= 2) // Only suggest if at least 2 donors are there
    .sort((a, b) => b.density_score - a.density_score);

  return recommendations.slice(0, 3); // Top 3 zones
}
