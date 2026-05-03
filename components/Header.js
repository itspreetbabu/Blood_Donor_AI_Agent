"use client";
// ============================================================
//  components/Header.js — Animated Hero Header
// ============================================================

import { useEffect, useState } from "react";
import styles from "./Header.module.css";

export default function Header({ systemStatus, onRunAgent, onEmergency, isRunning, lastRun }) {
  const [tick, setTick] = useState(0);

  // Pulse counter for live activity indicator
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const statusColor = { SAFE: "var(--green)", WARNING: "var(--amber)", CRITICAL: "var(--red)" }[systemStatus] || "var(--text-muted)";
  const statusLabel = systemStatus || "INITIALIZING";

  return (
    <header className={styles.header}>
      {/* Background grid */}
      <div className={styles.grid} aria-hidden />

      <div className={styles.inner}>
        {/* Left: Logo + Agent Status */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.drop}>🩸</span>
            <div>
              <h1 className={styles.title}>HemoAgent</h1>
              <p className={styles.subtitle}>AI Blood Donation Intelligence System</p>
            </div>
          </div>

          <div className={styles.statusRow}>
            <span className={styles.agentPill}>
              <span className={styles.agentDot} style={{ background: isRunning ? "var(--amber)" : "var(--green)" }} />
              {isRunning ? "AGENT RUNNING" : "AGENT ACTIVE"}
            </span>

            <div className={styles.systemBadge} style={{ borderColor: statusColor + "55", color: statusColor }}>
              <span className={styles.statusDot} style={{ background: statusColor }} />
              SYSTEM {statusLabel}
            </div>
          </div>
        </div>

        {/* Right: Stats + Action Buttons */}
        <div className={styles.right}>
          <div className={styles.statRow}>
            <div className={styles.miniStat}>
              <span className={styles.miniVal} style={{ color: "var(--red)" }}>8</span>
              <span className={styles.miniLabel}>Blood Groups</span>
            </div>
            <div className={styles.miniDivider} />
            <div className={styles.miniStat}>
              <span className={styles.miniVal} style={{ color: "var(--green)" }}>15</span>
              <span className={styles.miniLabel}>Registered Donors</span>
            </div>
            <div className={styles.miniDivider} />
            <div className={styles.miniStat}>
              <span className={styles.miniVal} style={{ color: "var(--amber)" }}>
                {tick % 60 < 10 ? `0${tick % 60}` : tick % 60}s
              </span>
              <span className={styles.miniLabel}>Live Monitor</span>
            </div>
          </div>

          <div className={styles.actions}>
            {lastRun && (
              <span className={styles.lastRun}>
                Last run: {new Date(lastRun).toLocaleTimeString()}
              </span>
            )}
            <button
              id="btn-emergency"
              className="btn btn-amber"
              onClick={onEmergency}
            >
              🚨 Emergency
            </button>
            <button
              id="btn-run-agent"
              className="btn btn-primary"
              onClick={onRunAgent}
              disabled={isRunning}
            >
              {isRunning ? (
                <><div className="spinner" /> Running…</>
              ) : (
                <>⚡ Run Agent</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Alert banner if CRITICAL */}
      {systemStatus === "CRITICAL" && (
        <div className={styles.criticalBanner}>
          <span>🔴</span>
          <strong>CRITICAL ALERT:</strong> One or more blood groups are at critically low levels. Immediate action required.
        </div>
      )}
      {systemStatus === "WARNING" && (
        <div className={styles.warningBanner}>
          <span>🟡</span>
          <strong>WARNING:</strong> Some blood groups are approaching minimum threshold. Monitoring activated.
        </div>
      )}
    </header>
  );
}
