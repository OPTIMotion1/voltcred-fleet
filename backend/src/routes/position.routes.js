const express = require("express");
const router = express.Router();

const { getPositions } = require("../services/traccar.service");

// GET /api/positions
router.get("/", async (req, res) => {
  try {
    const positions = await getPositions();

    res.json(positions);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;