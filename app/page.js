"use client";
// ============================================================
//  app/page.js — HemoAgent Main Dashboard
// ============================================================

import { useState, useEffect, useCallback } from "react";
import Header        from "@/components/Header";
import StatsBar      from "@/components/StatsBar";
import InventoryPanel from "@/components/InventoryPanel";
import AgentConsole  from "@/components/AgentConsole";
import DonorTable    from "@/components/DonorTable";
import TrendChart    from "@/components/TrendChart";
import EmergencyModal from "@/components/EmergencyModal";
import DriveRecommendations from "@/components/DriveRecommendations";
import { inventoryTrends } from "@/lib/mockData";

export default function DashboardPage() {
  // ── State ────────────────────────────────────────────────
  const [inventory, setInventory]         = useState([]);
  const [agentResult, setAgentResult]     = useState(null);
  const [isRunning, setIsRunning]         = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [agentRuns, setAgentRuns]         = useState(0);
  const [lastRun, setLastRun]             = useState(null);
  const [sessionDonors, setSessionDonors] = useState(null);
  const [bootDone, setBootDone]           = useState(false);

  // ── Derived values ────────────────────────────────────────
  const systemStatus   = agentResult?.status ?? (inventory.length ? deriveStatus(inventory) : null);
  const matchedDonors  = agentResult?.matched_donors ?? [];
  const notifSent      = agentResult?.notifications_sent ? matchedDonors.length : 0;

  // ── Boot: load initial inventory snapshot ─────────────────
  useEffect(() => {
    fetch("/api/agent")
      .then((r) => r.json())
      .then((data) => {
        if (data.inventory) setInventory(data.inventory);
        if (data.donors)    setSessionDonors(data.donors);
        setBootDone(true);
      })
      .catch(() => setBootDone(true));
  }, []);

  // ── Run Agent ─────────────────────────────────────────────
  const runAgent = useCallback(async (emergencyRequest = null) => {
    setIsRunning(true);
    try {
      const body = { emergencyRequest };
      if (sessionDonors) body.updatedDonors = sessionDonors;

      const res  = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (json.success) {
        const data = json.data;
        setAgentResult(data);
        if (data.analyzed_inventory) setInventory(data.analyzed_inventory);
        if (data.updated_donors)     setSessionDonors(data.updated_donors);
        setAgentRuns((n) => n + 1);
        setLastRun(new Date().toISOString());
      }
    } catch (err) {
      console.error("Agent run failed:", err);
    } finally {
      setIsRunning(false);
    }
  }, [sessionDonors]);

  // ── Auto-run on boot ──────────────────────────────────────
  useEffect(() => {
    if (bootDone) runAgent();
  }, [bootDone]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Emergency handler ─────────────────────────────────────
  const handleEmergency = async (request) => {
    await runAgent(request);
  };

  // ── Handle Donor Response (Learning) ────────────────────
  const handleDonorResponse = (donorId, response) => {
    if (!sessionDonors) return;
    
    // Update master session list (for future runs)
    const updatedSession = sessionDonors.map(d => {
      if (d.donor_id === donorId) {
        return {
          ...d,
          response_history: [...(d.response_history || []), response]
        };
      }
      return d;
    });
    setSessionDonors(updatedSession);

    // Update current UI state immediately
    if (agentResult) {
      const updatedMatched = agentResult.matched_donors.map(d => {
        if (d.donor_id === donorId) {
          return { ...d, simulation_status: response };
        }
        return d;
      });
      setAgentResult({ ...agentResult, matched_donors: updatedMatched });
    }
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <main className="app-shell">
      <Header
        systemStatus={systemStatus}
        onRunAgent={() => runAgent()}
        onEmergency={() => setShowEmergency(true)}
        isRunning={isRunning}
        lastRun={lastRun}
      />

      <StatsBar
        inventory={inventory}
        matchedDonors={matchedDonors.length}
        notificationsSent={notifSent}
        agentRuns={agentRuns}
      />

      {/* Blood Inventory Grid */}
      <section style={{ marginBottom: 32 }}>
        <InventoryPanel inventory={inventory} />
      </section>

      {/* Agent Console + Trend Chart */}
      <section className="grid-2" style={{ marginBottom: 32 }}>
        <AgentConsole
          log={agentResult?.agent_log ?? []}
          jsonOutput={agentResult}
          isRunning={isRunning}
        />
        <TrendChart trends={inventoryTrends} inventory={inventory} />
      </section>

      {/* Strategic Recommendations */}
      {agentResult?.drive_recommendations?.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <DriveRecommendations recommendations={agentResult.drive_recommendations} />
        </section>
      )}

      {/* Recommended Action Banner */}
      {agentResult?.recommended_action && (
        <section style={{ marginBottom: 24 }}>
          <div className={`card fade-in ${actionBannerClass(systemStatus)}`}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>{actionIcon(systemStatus)}</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>
                  Agent Recommended Action
                </p>
                <p style={{ fontSize: 15, fontWeight: 600, color: actionColor(systemStatus) }}>
                  {agentResult.recommended_action}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section style={{ marginBottom: 32 }}>
        <DonorTable
          donors={matchedDonors}
          notificationsEnabled={agentResult?.notifications_sent}
          onDonorResponse={handleDonorResponse}
        />
      </section>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "24px 0", borderTop: "1px solid var(--border)" }}>
        <p className="meta">
          HemoAgent v1.0 — Autonomous AI Blood Donation Intelligence System &nbsp;|&nbsp;
          <span style={{ color: "var(--green)" }}>⚡ Agent Active</span> &nbsp;|&nbsp;
          Data simulated for demonstration purposes
        </p>
      </footer>

      {/* Emergency Modal */}
      {showEmergency && (
        <EmergencyModal
          onClose={() => setShowEmergency(false)}
          onSubmit={handleEmergency}
        />
      )}
    </main>
  );
}

// ── Helpers ────────────────────────────────────────────────

function deriveStatus(inv) {
  if (inv.some((i) => i.risk === "CRITICAL")) return "CRITICAL";
  if (inv.some((i) => i.risk === "WARNING"))  return "WARNING";
  return "SAFE";
}

function actionBannerClass(status) {
  if (status === "CRITICAL") return "action-critical";
  if (status === "WARNING")  return "action-warning";
  return "action-safe";
}

function actionColor(status) {
  if (status === "CRITICAL") return "var(--red)";
  if (status === "WARNING")  return "var(--amber)";
  return "var(--green)";
}

function actionIcon(status) {
  if (status === "CRITICAL") return "🚨";
  if (status === "WARNING")  return "⚠️";
  return "✅";
}
