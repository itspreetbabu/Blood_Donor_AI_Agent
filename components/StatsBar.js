"use client";
// ============================================================
//  components/StatsBar.js — Summary KPI Strip
// ============================================================

import styles from "./StatsBar.module.css";

export default function StatsBar({ inventory, matchedDonors, notificationsSent, agentRuns }) {
  const critical = inventory?.filter((i) => i.risk === "CRITICAL").length ?? 0;
  const warning  = inventory?.filter((i) => i.risk === "WARNING").length ?? 0;
  const safe     = inventory?.filter((i) => i.risk === "SAFE").length ?? 0;
  const shortages = inventory?.filter((i) => i.predicted_shortage).length ?? 0;

  const stats = [
    { label: "Critical Groups",     value: critical,          color: "var(--red)",   icon: "🔴" },
    { label: "Warning Groups",      value: warning,           color: "var(--amber)", icon: "⚠️" },
    { label: "Safe Groups",         value: safe,              color: "var(--green)", icon: "✅" },
    { label: "Predicted Shortages", value: shortages,         color: "var(--red)",   icon: "📉" },
    { label: "Donors Matched",      value: matchedDonors ?? 0, color: "var(--blue)", icon: "👥" },
    { label: "Notifications Sent",  value: notificationsSent ?? 0, color: "#a78bfa", icon: "📩" },
    { label: "Agent Runs",          value: agentRuns ?? 0,    color: "var(--green)", icon: "⚡" },
  ];

  return (
    <div className={styles.bar}>
      {stats.map((s, i) => (
        <div key={i} className={styles.stat}>
          <span className={styles.icon}>{s.icon}</span>
          <span className={styles.value} style={{ color: s.color }}>{s.value}</span>
          <span className={styles.label}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
