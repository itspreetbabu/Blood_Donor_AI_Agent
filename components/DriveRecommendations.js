"use client";
// ============================================================
//  components/DriveRecommendations.js — Intelligent Drive Suggestions
// ============================================================

import styles from "./DriveRecommendations.module.css";

export default function DriveRecommendations({ recommendations }) {
  const handleSchedule = (i) => {
    alert(`📅 Success: Donation Drive Scheduled for Area Cluster #${i + 1}! The agent has been notified to prioritize this location.`);
  };

  return (
    <div className={`card fade-in ${styles.container}`}>
      <p className="section-title">📍 Strategic Donation Drives — Density Clusters</p>
      
      <div className={styles.grid}>
        {recommendations.map((zone, i) => (
          <div key={i} className={styles.zoneCard}>
            <div className={styles.zoneHeader}>
              <span className={styles.densityBadge}>{zone.count} Donors Nearby</span>
              <span className={styles.coords}>LAT: {zone.lat} | LNG: {zone.lng}</span>
            </div>
            
            <div className={styles.areaInfo}>
              <strong>Area Cluster #{i + 1}</strong>
              <p className={styles.desc}>Highly dense area identified. Suggested for mobile donation drive.</p>
            </div>

            <div className={styles.groupChips}>
              {zone.blood_groups.map(bg => (
                <span key={bg} className={styles.chip}>{bg}</span>
              ))}
            </div>

            <button 
              className={`btn btn-amber ${styles.btnFull}`}
              onClick={() => handleSchedule(i)}
            >
              📅 Schedule Drive
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
