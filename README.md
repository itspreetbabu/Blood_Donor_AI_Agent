# 🩸 Blood Donor AI Agent

### Autonomous Blood Donation System using Agentic AI

🚨 **Predict. Decide. Act. Save Lives.**

---

## 📌 Overview

Blood shortages in emergency situations often lead to critical delays.
Most systems are reactive — they respond *after* the shortage occurs.

This project introduces an **Agentic AI-powered system** that proactively:

* Monitors blood inventory
* Predicts shortages
* Matches donors
* Triggers alerts automatically

---

## 🧠 What Makes This Project Unique?

Unlike traditional apps, this system follows a complete **AI Agent Loop**:

**Analyze → Predict → Decide → Act → Learn**

It is not just a dashboard — it is an **autonomous decision-making system**.

---

## ⚙️ Core Features

✅ Real-time blood inventory monitoring
✅ Shortage prediction using usage trends
✅ Smart donor matching (location + eligibility)
✅ Automated notification system
✅ Agent memory (learns from donor responses)
✅ Live Agent Console (JSON decision logs)

---

## 🧩 Agent Workflow

1. **Analyze**
   Evaluates current blood stock levels

2. **Predict**
   Forecasts shortages based on daily usage

3. **Decide**
   Determines urgency (SAFE / WARNING / CRITICAL)

4. **Match**
   Finds nearest eligible donors

5. **Act**
   Sends alerts & suggests donation drives

6. **Learn**
   Updates donor priority based on responses

---

## 🖥️ Dashboard Preview

* Inventory Panel (color-coded risk levels)
* Agent Console (real-time decision logs)
* Donor Matching Table
* Shortage Trend Charts

---

## 🏗️ Tech Stack

| Layer       | Technology                     |
| ----------- | ------------------------------ |
| Frontend    | Next.js (React)                |
| Backend     | API Routes (Node.js)           |
| Agent Logic | JavaScript (Custom Agent Core) |
| Styling     | CSS (Dark Theme UI)            |
| Charts      | Chart.js                       |
| Deployment  | Google Cloud Run               |

---

## 📂 Project Structure

```
app/
 ├── page.js              # Main dashboard
 ├── api/agent/route.js   # Agent API
components/
 ├── InventoryPanel.js
 ├── AgentConsole.js
 ├── DonorTable.js
lib/
 ├── agentCore.js
 ├── donorMatcher.js
 ├── inventoryAnalyzer.js
```

---

## 🚀 How It Works

* The system simulates live blood inventory data
* The agent processes this data continuously
* It predicts shortages and triggers actions automatically
* Results are displayed in real time on the dashboard

---

## 🧪 Example Agent Output

```json
{
  "status": "CRITICAL",
  "predicted_shortage": true,
  "recommended_action": "Notify nearby donors",
  "matched_donors": [
    {
      "donor_id": "D102",
      "distance": "2.3 km",
      "priority_score": 92
    }
  ],
  "notifications_sent": true
}
```

---

## 🎯 Use Cases

* Hospitals & Blood Banks
* Emergency Response Systems
* Smart Healthcare Infrastructure
* AI-based Public Health Solutions

---

## 🔥 Future Improvements

* Real-time GPS-based donor tracking
* Integration with government blood bank APIs
* Mobile app version
* Multi-agent collaboration system

---

## 📽️ Demo

👉 https://blood-donor-agent-739992457607.us-central1.run.app/

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork, improve, and raise PRs.

---

Designed and built using Agentic AI tools, focusing on architecture, logic, and real-world impact.”

---
