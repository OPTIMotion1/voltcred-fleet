const express = require("express");
const router = express.Router();

const { getDevices } = require("../services/traccar.service");

// GET /api/vehicles -> live device list from Traccar
router.get("/", async (req, res) => {
  try {
    const devices = await getDevices();

    // Normalize to the shape the frontend expects
    const vehicles = devices.map((d) => ({
      id: d.id,                 // Traccar deviceId — same id positions use
      name: d.name || d.uniqueId,
      status: d.status,         // "online" | "offline" | "unknown"
      lastUpdate: d.lastUpdate,
    }));

    res.json(vehicles);
  } catch (error) {
    console.log("ERROR fetching vehicles:", error.response?.status, error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;