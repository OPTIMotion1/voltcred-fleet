const express = require("express");
const cors = require("cors");
require("dotenv").config();

const vehicleRoutes = require("./routes/vehicle.routes");
const positionRoutes = require("./routes/position.routes");
const commandRoutes = require("./routes/command.routes");
const reportsRoutes = require("./routes/reports.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VoltCred Fleet Backend Running",
  });
});

app.use("/api/vehicles", vehicleRoutes);
app.use("/api/vehicles", commandRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/reports", reportsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});