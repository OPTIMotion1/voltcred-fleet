const express = require("express");
const router = express.Router();
const { authedRequest } = require("../services/traccar.service");

// GET /api/reports/trips?deviceId=&from=&to=
router.get("/trips", async (req, res) => {
  try {
    const { deviceId, from, to } = req.query;
    if (!deviceId || !from || !to) {
      return res.status(400).json({ success: false, error: "deviceId, from, to are required" });
    }
    const data = await authedRequest(
      "get",
      `/api/reports/trips?deviceId=${deviceId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    );
    res.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.log("ERROR fetching trips:", error.response?.status, error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

// GET /api/reports/summary?deviceId=&from=&to=
router.get("/summary", async (req, res) => {
  try {
    const { deviceId, from, to } = req.query;
    if (!deviceId || !from || !to) {
      return res.status(400).json({ success: false, error: "deviceId, from, to are required" });
    }
    const data = await authedRequest(
      "get",
      `/api/reports/summary?deviceId=${deviceId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    );
    res.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.log("ERROR fetching summary:", error.response?.status, error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

// GET /api/reports/route?deviceId=&from=&to=
router.get("/route", async (req, res) => {
  try {
    const { deviceId, from, to } = req.query;
    if (!deviceId || !from || !to) {
      return res.status(400).json({ success: false, error: "deviceId, from, to are required" });
    }
    const data = await authedRequest(
      "get",
      `/api/reports/route?deviceId=${deviceId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    );
    res.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.log("ERROR fetching route:", error.response?.status, error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

module.exports = router;
