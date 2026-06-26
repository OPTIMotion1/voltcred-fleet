const express = require("express");
const router = express.Router();

const { getCommandTypes, sendCommand } = require("../services/traccar.service");

// Only these command types can ever be sent through this route, regardless
// of what a client request asks for. This is a deliberate allow-list so an
// arbitrary/unexpected command type can never reach a real vehicle.
const ALLOWED_COMMANDS = ["engineStop", "engineResume"];

// GET /api/vehicles/:id/commands -> which commands this device supports
router.get("/:id/commands", async (req, res) => {
  try {
    const types = await getCommandTypes(req.params.id);
    const supported = types
      .map((t) => t.type)
      .filter((type) => ALLOWED_COMMANDS.includes(type));

    res.json({ supported });
  } catch (error) {
    console.log("ERROR fetching command types:", error.response?.status, error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

// POST /api/vehicles/:id/command  { "type": "engineStop" }
router.post("/:id/command", async (req, res) => {
  const { type } = req.body;
  const deviceId = req.params.id;

  if (!ALLOWED_COMMANDS.includes(type)) {
    return res.status(400).json({
      success: false,
      error: `Command type "${type}" is not permitted. Allowed: ${ALLOWED_COMMANDS.join(", ")}`,
    });
  }

  try {
    const result = await sendCommand(deviceId, type);
    // Traccar accepting the command means it was sent/queued — it does NOT
    // confirm the vehicle has executed it. Be explicit about that in the response.
    res.json({
      success: true,
      message: "Command sent to Traccar. The vehicle confirms execution separately and may take time to respond.",
      result,
    });
  } catch (error) {
    console.log("ERROR sending command:", error.response?.status, error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;