// ============================================================
//  lib/mockData.js — Seed data for the Blood Donor AI Agent
// ============================================================

export const bloodInventory = [
  { blood_group: "A+",  current_units: 45, minimum_required_units: 50, daily_usage_rate: 8  },
  { blood_group: "A-",  current_units: 12, minimum_required_units: 20, daily_usage_rate: 3  },
  { blood_group: "B+",  current_units: 60, minimum_required_units: 50, daily_usage_rate: 7  },
  { blood_group: "B-",  current_units: 8,  minimum_required_units: 20, daily_usage_rate: 4  },
  { blood_group: "AB+", current_units: 30, minimum_required_units: 30, daily_usage_rate: 5  },
  { blood_group: "AB-", current_units: 5,  minimum_required_units: 15, daily_usage_rate: 2  },
  { blood_group: "O+",  current_units: 75, minimum_required_units: 70, daily_usage_rate: 12 },
  { blood_group: "O-",  current_units: 10, minimum_required_units: 40, daily_usage_rate: 6  },
];

export const donors = [
  { donor_id: "D001", name: "Aarav Sharma",   blood_group: "O-",  location: { lat: 28.6139, lng: 77.2090 }, last_donation_date: "2025-12-01", availability_status: "available",   priority_score: 85, response_history: ["responded", "responded", "ignored"] },
  { donor_id: "D002", name: "Priya Menon",    blood_group: "O-",  location: { lat: 28.6200, lng: 77.2200 }, last_donation_date: "2026-01-15", availability_status: "unavailable", priority_score: 60, response_history: ["ignored"] },
  { donor_id: "D003", name: "Rohan Verma",    blood_group: "A-",  location: { lat: 28.6300, lng: 77.2150 }, last_donation_date: "2025-11-20", availability_status: "available",   priority_score: 92, response_history: ["responded", "responded"] },
  { donor_id: "D004", name: "Sanya Kapoor",   blood_group: "B-",  location: { lat: 28.6050, lng: 77.1980 }, last_donation_date: "2025-10-05", availability_status: "available",   priority_score: 78, response_history: ["responded"] },
  { donor_id: "D005", name: "Kiran Nair",     blood_group: "AB-", location: { lat: 28.6180, lng: 77.2300 }, last_donation_date: "2026-01-10", availability_status: "available",   priority_score: 55, response_history: [] },
  { donor_id: "D006", name: "Arjun Singh",    blood_group: "O-",  location: { lat: 28.6100, lng: 77.2050 }, last_donation_date: "2025-08-14", availability_status: "available",   priority_score: 95, response_history: ["responded", "responded", "responded"] },
  { donor_id: "D007", name: "Meera Iyer",     blood_group: "AB-", location: { lat: 28.6250, lng: 77.2120 }, last_donation_date: "2025-09-30", availability_status: "available",   priority_score: 70, response_history: ["responded", "ignored"] },
  { donor_id: "D008", name: "Vikram Patel",   blood_group: "A-",  location: { lat: 28.6070, lng: 77.2010 }, last_donation_date: "2025-07-22", availability_status: "available",   priority_score: 88, response_history: ["responded", "responded"] },
  { donor_id: "D009", name: "Divya Reddy",    blood_group: "B-",  location: { lat: 28.6150, lng: 77.2180 }, last_donation_date: "2025-12-15", availability_status: "available",   priority_score: 72, response_history: ["responded"] },
  { donor_id: "D010", name: "Nikhil Gupta",   blood_group: "O+",  location: { lat: 28.6220, lng: 77.2080 }, last_donation_date: "2026-02-01", availability_status: "available",   priority_score: 65, response_history: ["ignored", "ignored"] },
  { donor_id: "D011", name: "Ananya Bose",    blood_group: "AB-", location: { lat: 28.6000, lng: 77.1950 }, last_donation_date: "2025-10-20", availability_status: "available",   priority_score: 80, response_history: ["responded"] },
  { donor_id: "D012", name: "Rahul Joshi",    blood_group: "O-",  location: { lat: 28.6320, lng: 77.2260 }, last_donation_date: "2025-06-18", availability_status: "unavailable", priority_score: 50, response_history: [] },
  { donor_id: "D013", name: "Tanvi Kulkarni", blood_group: "A+",  location: { lat: 28.6080, lng: 77.2100 }, last_donation_date: "2025-11-05", availability_status: "available",   priority_score: 76, response_history: ["responded"] },
  { donor_id: "D014", name: "Suresh Kumar",   blood_group: "B+",  location: { lat: 28.6170, lng: 77.2040 }, last_donation_date: "2026-01-25", availability_status: "available",   priority_score: 63, response_history: ["ignored"] },
  { donor_id: "D015", name: "Pooja Agarwal",  blood_group: "O-",  location: { lat: 28.6130, lng: 77.2230 }, last_donation_date: "2025-09-10", availability_status: "available",   priority_score: 90, response_history: ["responded", "responded"] },
];

export const hospitalLocation = { lat: 28.6139, lng: 77.2090 }; // AIIMS Delhi

export const emergencyRequests = [
  { blood_group: "O-", units_required: 10, hospital_location: { lat: 28.6139, lng: 77.2090 } },
];

// 7-day historical trend (units per day) per blood group
export const inventoryTrends = {
  "A+":  [52, 50, 48, 46, 45, 44, 45],
  "A-":  [18, 16, 15, 13, 12, 12, 12],
  "B+":  [58, 59, 61, 60, 62, 61, 60],
  "B-":  [14, 12, 11, 10, 9,  8,  8 ],
  "AB+": [32, 31, 30, 30, 30, 29, 30],
  "AB-": [9,  8,  7,  6,  5,  5,  5 ],
  "O+":  [80, 78, 76, 77, 75, 75, 75],
  "O-":  [22, 20, 18, 15, 13, 11, 10],
};
