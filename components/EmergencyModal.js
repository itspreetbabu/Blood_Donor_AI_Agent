"use client";
// ============================================================
//  components/EmergencyModal.js — Emergency Request Form
// ============================================================

import { useState } from "react";
import styles from "./EmergencyModal.module.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function EmergencyModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    blood_group: "O-",
    units_required: 5,
    hospital_name: "AIIMS Delhi",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({
      blood_group: form.blood_group,
      units_required: parseInt(form.units_required, 10),
      hospital_location: { lat: 28.6139, lng: 77.2090 },
      hospital_name: form.hospital_name,
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">
          <span>🚨</span>
          Emergency Blood Request
        </div>

        <p className={styles.desc}>
          Submit an emergency request to immediately trigger the agent, match donors, and send urgent notifications.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="em-blood-group">Blood Group Required</label>
            <select
              id="em-blood-group"
              className="input-field"
              value={form.blood_group}
              onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="em-units">Units Required</label>
            <input
              id="em-units"
              type="number"
              min={1}
              max={50}
              className="input-field"
              value={form.units_required}
              onChange={(e) => setForm({ ...form, units_required: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="em-hospital">Hospital Name</label>
            <input
              id="em-hospital"
              type="text"
              className="input-field"
              value={form.hospital_name}
              onChange={(e) => setForm({ ...form, hospital_name: e.target.value })}
            />
          </div>

          <div className={styles.urgencyNote}>
            ⚡ This will override the decision gate and immediately trigger donor matching + notifications for{" "}
            <strong style={{ color: "var(--red)" }}>{form.blood_group}</strong>.
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" id="btn-em-submit" disabled={submitting}>
              {submitting ? <><div className="spinner" /> Processing…</> : "🚨 Trigger Emergency"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
