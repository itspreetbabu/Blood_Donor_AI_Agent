"use client";
// ============================================================
//  components/InventoryPanel.js — 8 Blood Group Cards
// ============================================================

import styles from "./InventoryPanel.module.css";

const RISK_CONFIG = {
  SAFE:     { cls: "badge-safe",     label: "Safe",     barCls: "fill-safe",     icon: "✅" },
  WARNING:  { cls: "badge-warning",  label: "Warning",  barCls: "fill-warning",  icon: "⚠️" },
  CRITICAL: { cls: "badge-critical", label: "Critical", barCls: "fill-critical", icon: "🔴" },
};

const BG_COLORS = {
  "A+": "#e63946", "A-": "#c1121f",
  "B+": "#4895ef", "B-": "#023e8a",
  "AB+":"#7b2d8b", "AB-":"#560a86",
  "O+": "#2ec4b6", "O-": "#0d8a7f",
};

export default function InventoryPanel({ inventory }) {
  if (!inventory?.length) return null;

  return (
    <div>
      <p className="section-title">🩸 Blood Inventory — Live Status</p>
      <div className={`blood-grid stagger ${styles.grid}`}>
        {inventory.map((item, i) => {
          const cfg = RISK_CONFIG[item.risk] || RISK_CONFIG.SAFE;
          const pct = Math.min(100, Math.round((item.current_units / Math.max(item.minimum_required_units * 1.5, 1)) * 100));
          const accentColor = BG_COLORS[item.blood_group] || "var(--red)";
          const daysStyle = item.days_remaining <= 3 ? { color: "var(--red)", fontWeight: 700 }
            : item.days_remaining <= 7 ? { color: "var(--amber)", fontWeight: 600 }
            : { color: "var(--green)" };

          return (
            <div
              key={item.blood_group}
              className={`card fade-up ${styles.card} ${item.risk === "CRITICAL" ? styles.criticalCard : ""}`}
              style={{ animationDelay: `${i * 0.06}s`, "--accent": accentColor }}
            >
              {/* Top bar accent */}
              <div className={styles.topBar} style={{ background: accentColor }} />

              {/* Header */}
              <div className={styles.cardTop}>
                <div className={styles.bloodGroup} style={{ color: accentColor }}>
                  {item.blood_group}
                </div>
                <span className={`badge ${cfg.cls}`}>
                  {cfg.icon} {cfg.label}
                </span>
              </div>

              {/* Main stat */}
              <div className={styles.mainStat}>
                <span className={styles.currentUnits} style={{ color: accentColor }}>
                  {item.current_units}
                </span>
                <span className={styles.unit}>/ {item.minimum_required_units} units</span>
              </div>

              {/* Progress bar */}
              <div className="progress-bar" style={{ margin: "12px 0" }}>
                <div className={`progress-fill ${cfg.barCls}`} style={{ width: `${pct}%` }} />
              </div>

              {/* Meta */}
              <div className={styles.meta}>
                <div className={styles.metaRow}>
                  <span className="meta">Daily usage</span>
                  <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{item.daily_usage_rate} u/day</span>
                </div>
                <div className={styles.metaRow}>
                  <span className="meta">Days left</span>
                  <span style={daysStyle}>{item.days_remaining === Infinity ? "∞" : `${item.days_remaining}d`}</span>
                </div>
                {item.predicted_shortage && (
                  <div className={styles.shortageTag}>
                    📉 Predicted Shortage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
