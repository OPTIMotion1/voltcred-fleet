const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const vehicleRoutes = require("./routes/vehicle.routes");
const positionRoutes = require("./routes/position.routes");
const commandRoutes = require("./routes/command.routes");
const reportsRoutes = require("./routes/reports.routes");

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/vehicles", commandRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/reports", reportsRoutes);

// Serve built frontend in production
// On Railway: /app/backend/src/app.js → dist is at /app/frontend/dist
// __dirname = /app/backend/src, so go up 2 levels then into frontend/dist
const frontendDist = path.join(__dirname, "..", "..", "frontend", "dist");

if (require("fs").existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ success: true, message: "VoltCred Fleet Backend Running" });
  });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend dist path: ${frontendDist}`);
  console.log(`Frontend dist exists: ${require("fs").existsSync(frontendDist)}`);
});