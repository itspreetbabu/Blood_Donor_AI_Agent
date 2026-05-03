"use client";
// ============================================================
//  components/DonorTable.js — Matched Donors with Priority
// ============================================================

import styles from "./DonorTable.module.css";

function PriorityDots({ score }) {
  const level = score >= 80 ? 5 : score >= 60 ? 4 : score >= 40 ? 3 : score >= 20 ? 2 : 1;
  const color = score >= 80 ? "var(--red)" : score >= 60 ? "var(--amber)" : "var(--green)";
  return (
    <div className={styles.dotRow}>
      {[1, 2, 3, 4, 5].map((d) => (
        <span
          key={d}
          className={styles.dot}
          style={{ background: d <= level ? color : "var(--bg-surface)" }}
        />
      ))}
      <span className={styles.scoreNum} style={{ color }}>{score}</span>
    </div>
  );
}

export default function DonorTable({ donors, notificationsEnabled, onDonorResponse }) {
  if (!donors?.length) {
    return (
      <div className={`card ${styles.empty}`}>
        <p className="section-title">🎯 Matched Donors</p>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>👥</span>
          <p>No donors matched yet. Run the agent to find eligible donors.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="section-title">🎯 Matched Donors — Sorted by Distance & Priority</p>
      <div className={styles.tableWrap}>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Donor</th>
              <th>Blood Group</th>
              <th>Distance</th>
              <th>Priority</th>
              <th>Last Donated</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((d, i) => (
              <tr key={d.donor_id} className={`fade-up ${styles.row}`} style={{ animationDelay: `${i * 0.05}s` }}>
                <td className={styles.rank}>#{i + 1}</td>
                <td>
                  <div className={styles.donorCell}>
                    <div className={styles.avatar} style={{ background: avatarColor(d.blood_group) }}>
                      {d.name.charAt(0)}
                    </div>
                    <div>
                      <div>{d.name}</div>
                      <div className="meta">{d.donor_id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={styles.bgBadge} style={{ background: bgColor(d.blood_group) + "22", color: bgColor(d.blood_group), border: `1px solid ${bgColor(d.blood_group)}55` }}>
                    {d.blood_group}
                  </span>
                </td>
                <td>
                  <div className={styles.distanceCell}>
                    <span className={styles.distanceVal}>{d.distance_km}</span>
                    <span className="meta"> km</span>
                  </div>
                </td>
                <td>
                  <PriorityDots score={d.priority_score} />
                </td>
                <td>
                  <span className="meta">{d.days_since_donation}d ago</span>
                </td>
                <td>
                  {notificationsEnabled ? (
                    <div className={styles.actionCell}>
                      {d.simulation_status ? (
                        <span className={d.simulation_status === "responded" ? "badge badge-safe" : "badge badge-warning"}>
                          {d.simulation_status === "responded" ? "✓ Responded" : "✕ Ignored"}
                        </span>
                      ) : (
                        <>
                          <button 
                            className={styles.miniBtnResponded} 
                            onClick={() => onDonorResponse(d.donor_id, "responded")}
                            title="Mark as Responded (+5 Priority)"
                          >
                            ✓
                          </button>
                          <button 
                            className={styles.miniBtnIgnored} 
                            onClick={() => onDonorResponse(d.donor_id, "ignored")}
                            title="Mark as Ignored (-3 Priority)"
                          >
                            ✕
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <span className={`badge ${d.availability_status === "available" ? "badge-safe" : "badge-warning"}`}>
                      {d.availability_status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <span className="meta">Sorted: nearest first → highest priority</span>
        {notificationsEnabled && (
          <span className="notif-pill">📩 {donors.length} notification{donors.length !== 1 ? "s" : ""} sent</span>
        )}
      </div>
    </div>
  );
}

function avatarColor(bg) {
  const map = { "A+":"#e63946","A-":"#c1121f","B+":"#4895ef","B-":"#023e8a","AB+":"#7b2d8b","AB-":"#560a86","O+":"#2ec4b6","O-":"#0d8a7f" };
  return map[bg] || "#555";
}

function bgColor(bg) {
  return avatarColor(bg);
}
