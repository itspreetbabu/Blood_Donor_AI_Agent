"use client";
// ============================================================
//  components/AgentConsole.js — Live Agent Decision Log
// ============================================================

import { useEffect, useRef } from "react";
import styles from "./AgentConsole.module.css";

function formatLogEntry(entry, index) {
  const stepColors = {
    0: "#8899bb",
    1: "var(--blue)",
    2: "var(--green)",
    3: "var(--amber)",
    4: "var(--red)",
    5: "#a78bfa",
    6: "#34d399",
  };
  const color = stepColors[entry.step] || "var(--text-secondary)";

  const stepLabel = entry.step !== undefined ? `[STEP ${entry.step}]` : "[SYS]";
  const action = entry.action || "";
  const result = entry.result || entry.decision || entry.notification || entry.message || "";
  const details = entry.details || entry.recipient || "";

  return (
    <div
      key={index}
      className={styles.entry}
    >
      <span className={styles.stepBadge} style={{ color }}>
        {stepLabel}
      </span>
      <span className={styles.separator}> › </span>
      <span className={styles.actionName}>{action}:</span>
      <span className={styles.actionResult}> {result}</span>
      {details && <span className={styles.details}> ({details})</span>}
    </div>
  );
}

export default function AgentConsole({ log, jsonOutput, isRunning }) {
  const bottomRef = useRef(null);
  const consoleRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [log]);

  const hasData = log?.length > 0;

  return (
    <div className={`card ${styles.console}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.dots}>
          <span className={styles.dot} style={{ background: "#ff5f57" }} />
          <span className={styles.dot} style={{ background: "#febc2e" }} />
          <span className={styles.dot} style={{ background: "#28c840" }} />
        </div>
        <span className={styles.title}>agent_core.js — Decision Log</span>
        <div className={styles.liveTag}>
          {isRunning ? (
            <><span className={styles.blink}>●</span> RUNNING</>
          ) : hasData ? (
            <><span style={{ color: "var(--green)" }}>●</span> DONE</>
          ) : (
            <><span style={{ color: "var(--text-muted)" }}>●</span> IDLE</>
          )}
        </div>
      </div>

      {/* Log area */}
      <div className={styles.logArea} ref={consoleRef}>
        {!hasData && !isRunning && (
          <div className={styles.emptyState}>
            <span className={styles.cursor} />
            <span className={styles.emptyText}> Click &quot;Run Agent&quot; to execute the autonomous decision loop…</span>
          </div>
        )}
        {hasData && log.map((entry, i) => formatLogEntry(entry, i))}
        <div ref={bottomRef} />
      </div>

      {/* JSON Output section */}
      {jsonOutput && (
        <div className={styles.jsonSection}>
          <p className={styles.jsonLabel}>▼ AGENT OUTPUT JSON</p>
          <pre className={styles.jsonPre}>
            {JSON.stringify(
              {
                timestamp: jsonOutput.timestamp,
                status: jsonOutput.status,
                predicted_shortage: jsonOutput.predicted_shortage,
                shortage_groups: jsonOutput.shortage_groups,
                recommended_action: jsonOutput.recommended_action,
                notifications_sent: jsonOutput.notifications_sent,
                matched_donors: jsonOutput.matched_donors?.map((d) => ({
                  donor_id: d.donor_id,
                  distance_km: d.distance_km,
                  priority_score: d.priority_score,
                })),
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}
