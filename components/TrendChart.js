"use client";
// ============================================================
//  components/TrendChart.js — 7-Day Inventory Trend (Chart.js)
// ============================================================

import { useEffect, useRef } from "react";
import styles from "./TrendChart.module.css";

const GROUP_COLORS = {
  "A+": "#e63946","A-": "#c1121f","B+": "#4895ef","B-": "#023e8a",
  "AB+":"#a855f7","AB-":"#7c3aed","O+": "#2ec4b6","O-": "#0d8a7f",
};

const DAYS = ["6d ago","5d ago","4d ago","3d ago","2d ago","Yesterday","Today"];

export default function TrendChart({ trends, inventory }) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!trends || !canvasRef.current) return;

    const load = async () => {
      // Dynamically load Chart.js from CDN via script tag
      if (!window.Chart) {
        await new Promise((res) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js";
          s.onload = res;
          document.head.appendChild(s);
        });
      }

      if (chartRef.current) chartRef.current.destroy();

      const datasets = Object.entries(trends).map(([group, data]) => ({
        label: group,
        data,
        borderColor: GROUP_COLORS[group],
        backgroundColor: GROUP_COLORS[group] + "18",
        tension: 0.4,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 2,
      }));

      // Add minimum required lines as dashed reference
      const minDatasets = (inventory || []).map((item) => ({
        label: `${item.blood_group} Min`,
        data: Array(7).fill(item.minimum_required_units),
        borderColor: GROUP_COLORS[item.blood_group] + "44",
        borderDash: [5, 5],
        pointRadius: 0,
        borderWidth: 1,
        fill: false,
      }));

      chartRef.current = new window.Chart(canvasRef.current, {
        type: "line",
        data: { labels: DAYS, datasets: [...datasets, ...minDatasets] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: {
              labels: {
                color: "#8899bb",
                font: { family: "'Inter', sans-serif", size: 11 },
                boxWidth: 12,
                filter: (item) => !item.text.includes("Min"),
              },
            },
            tooltip: {
              backgroundColor: "#111c30",
              borderColor: "rgba(255,255,255,0.1)",
              borderWidth: 1,
              titleColor: "#f0f4ff",
              bodyColor: "#8899bb",
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} units`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: "rgba(255,255,255,0.04)" },
              ticks: { color: "#4a5a7a", font: { size: 11 } },
            },
            y: {
              grid: { color: "rgba(255,255,255,0.04)" },
              ticks: { color: "#4a5a7a", font: { size: 11 } },
              title: { display: true, text: "Units", color: "#4a5a7a", font: { size: 11 } },
            },
          },
        },
      });
    };

    load();
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [trends, inventory]);

  return (
    <div className="card">
      <p className="section-title">📈 7-Day Inventory Trend</p>
      <div className={styles.chartWrap}>
        <canvas ref={canvasRef} />
      </div>
      <p className="meta" style={{ marginTop: 12, textAlign: "center" }}>
        Dashed lines indicate minimum required threshold per blood group
      </p>
    </div>
  );
}
