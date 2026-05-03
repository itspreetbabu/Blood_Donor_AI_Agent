// ============================================================
//  app/api/agent/route.js — Agent API Interface
// ============================================================

import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agentCore";
import { bloodInventory, donors, hospitalLocation, emergencyRequests } from "@/lib/mockData";

// Stateless API — Baseline data from mockData, overrides from request body
export async function GET() {
  return NextResponse.json({
    success: true,
    inventory: bloodInventory,
    donors: donors,
    hospitalLocation,
    emergencyRequests,
  });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { emergencyRequest, updatedDonors, inventory } = body;

    // Use provided data or fall back to defaults
    const activeInventory = (inventory && inventory.length > 0) ? inventory : bloodInventory;
    const activeDonors    = (updatedDonors && updatedDonors.length > 0) ? updatedDonors : donors;

    const result = runAgent({
      inventory: activeInventory,
      donors: activeDonors,
      emergencyRequest: emergencyRequest || null,
      hospitalLocation,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Agent execution error:", err);
    return NextResponse.json({ 
      success: false, 
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined 
    }, { status: 500 });
  }
}
